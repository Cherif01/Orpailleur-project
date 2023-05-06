import { Component, OnInit } from '@angular/core';
import { LotService } from '../lot.service';
import { LINK_BASE } from 'src/app/config';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-detail-lot',
  templateUrl: './detail-lot.component.html',
  styleUrls: ['./detail-lot.component.css']
})
export class DetailLotComponent implements OnInit {

  page = "Lot"
  constructor(
    private serviceLot: LotService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public location: Location,
  ) { }

  Attributions = this.fb.group({
    arrivage: [0, Validators.required],
    achat: [0, Validators.required],
  })

  Attribution = new FormGroup({
    achat: new FormControl(0)
  });

  clotureInfo = new FormGroup({
    id: new FormControl(0),
    status: new FormControl(2)
  });

  title = 'Detail du lot'
  IDLot: any


  ngOnInit(): void {
    this.IDLot = this.activeroute.snapshot.params['id'];
    this.LotUniq()
    this.ListAchat()
  }

  // GET LOT
  LotUnique: any = []
  lotID_unique: number = 0
  LotUniq() {
    this.serviceLot.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        data.forEach(item => {
          if (item.id == this.IDLot) {
            // console.log(item);
            this.LotUnique = item
            // ACHAT
          }
        })
        // console.log(this.LotUnique)
      }
    })
  }


  // GET ACHAT
  List_Achat: any = []
  PoidTotalLot: number = 0
  PoidVenduLot: number = 0
  nb_barre: number = 0
  ListAchat() {
    this.serviceLot.getList(LINK_BASE, 'attribution').subscribe({
      next: (data) => {
        data.forEach(element => {
          if (element.arrivage.id == this.IDLot) {
            this.List_Achat.push(element);
            // console.log(element);
            this.serviceLot.getList(LINK_BASE, 'achat_items').subscribe({
              next: (n) => {
                n.forEach(elem => {
                  if (element.achat.id == elem.achat.id) {
                    console.log(elem);
                    this.PoidTotalLot += elem.poids_achat
                    this.nb_barre += 1
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  // Attribuer un achat a un lot
  AttributionForm(form: FormGroup): void {
    if (form.valid) {
      // this.Attribution.controls.arrivage.setValue(this.IDLot)
      //Envoyer dans la Base
      console.log(form.value);

      // this.serviceLot.PostElement('api', 'attribution' ,form.value).subscribe({
      //   next: (reponse: any) => console.log(reponse),
      //   error: (err: any) => console.log(err)
      // })
      form.reset()
      this.router.navigate(['/lot/detail-lot/' + this.IDLot])
    } else {
      console.log(form.value)
    }
  }

  // CLOTURE DU LOT
  ClotureLot(form: FormGroup): void {
    if(form.valid) {
      this.clotureInfo.controls.id.setValue(this.IDLot)
      console.log(form.value);
      this.serviceLot.updateResource('api', 'arrivage' ,form.value).subscribe({
        next: (reponse: any) => console.log(reponse),
        error: (err: any) => console.log(err)
      })
    }
  }








  // DRAG
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    console.log(event);
  }

}
