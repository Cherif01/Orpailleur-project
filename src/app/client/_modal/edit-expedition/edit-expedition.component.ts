import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { imprimerDiv } from 'src/app/app.component';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';
import { FixingClientDialogComponent } from 'src/app/etat-entreprise/fixing-client-dialog/fixing-client-dialog.component';

@Component({
  selector: 'app-edit-expedition',
  templateUrl: './edit-expedition.component.html',
  styleUrls: ['./edit-expedition.component.css'],
})
export class EditExpeditionComponent implements OnInit {
  dataList: any = [];
  filteredData: any = []; // Store the filtered data
  searchTerm: string = ''; // Search term for filtering

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  constructor(
    private service: ApiserviceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FixingClientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  // Fetch data from API
  poidsConakry: number = 0;
  carratConakry: number = 0;
  poidsDubai: number = 0;
  carratDubai: number = 0;
  getList(): void {
    this.service.LIST_BY_ID('client', 'getAchat.php', this.data.id).subscribe({
      next: (data: any) => {
        this.dataList = data.itemList;
        this.filteredData = [...this.dataList]; // Initialize filteredData with all items
        // AUtres valeurs
        this.poidsConakry = data.poidsConakry;
        this.carratConakry = data.carratConakry;
        this.poidsDubai = data.poidsDubai;
        this.carratDubai = data.carratDubai;
      },
      error: (err: any) => console.log('Erreur : ', err),
    });
  }

  // Filter data based on search term
  filterData(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredData = this.dataList.filter(
      (item: any) =>
        item.poids.toString().includes(searchTermLower) ||
        item.carrat.toString().includes(searchTermLower)
    );
  }

  // Save all modified rows
  updateRow() {
    // Collect all modified data
    const updatedData = this.filteredData.map((item: any) => ({
      id: item.id, // assuming each item has a unique 'id'
      poids: item.poids,
      carrat: item.carrat,
      res_poids: item.res_poids,
      res_carrat: item.res_carrat,
    }));

    // Variable to track if the snackBar has been displayed
    let snackBarDisplayed = false;

    // Loop through each item and send the data one by one
    updatedData.forEach((item: any) => {
      const formData = new FormData();
      formData.append('id', item.id.toString());
      formData.append('poids', item.poids.toString());
      formData.append('carrat', item.carrat.toString());
      formData.append('res_poids', item.res_poids.toString());
      formData.append('res_carrat', item.res_carrat.toString());

      // Send the updated data to the API for each item
      this.service.update('client', 'updateItem.php', formData).subscribe({
        next: (response) => {
          // console.log('Data updated successfully:', response);
          // Only show the snackBar if it hasn't been displayed yet
          if (response.status === 1 && !snackBarDisplayed) {
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            });
            snackBarDisplayed = true; // Mark as displayed
          } else if (response.status !== 1 && !snackBarDisplayed) {
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-danger', 'text-white'],
            });
            snackBarDisplayed = true; // Mark as displayed
          }
        },
        error: (error) => {
          console.error('Error updating data for item:', item.id, error);
          this.snackBar.open('Error updating data for item', 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-danger', 'text-white'],
          });
        },
      });
    });
  }

  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML);
  }
}
