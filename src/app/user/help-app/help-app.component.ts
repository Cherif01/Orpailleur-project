import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-app',
  templateUrl: './help-app.component.html',
  styleUrls: ['./help-app.component.css']
})
export class HelpAppComponent implements OnInit {

  title = 'Aide video'
  constructor(
    public location: Location
  ) { }

  ngOnInit(): void {
  }

  introduction() {
    let text: string = "Bonjour et bienvenue dans l'assistant dans notre application, je m'appele FIONA et je serai votre guide tout au long de ce tutoriel, cliquer sur une section et je vous expliquerais comment proceder ...! "
    // Obtenir le contenu du texte

    // Utiliser l'API SpeechSynthesis pour lire le texte
    const syntheseVocale = window.speechSynthesis;
    const messageVocal = new SpeechSynthesisUtterance(text);
    syntheseVocale.speak(messageVocal);

  }

  Tutoriel(id: number): void {
    let text = ""
    switch (id) {
      // Operation
      case 1:
        text = "Merci pour votre patience, dans l'onglet opération, il existe trois menu, à savoir : le tableau de bord. le LOT. et les achats. pour le Tableau de bord, vous y trouverai les statistique nécessaire regroupant toute les informations sur vos activités dans l'application. L'onglet lot, vous permet de créer un stockage pour les achats des fournisseurs, et l'historique de tout les archives des enregistrements en fonction de leurs placement dans le lot, en plus vous pouvez directement les carrats des achats selon leurs attribution, puis le menu achat vous permet de voir la liste de tout les achats du jour par defaut, et un calendrier vous permettant de rechercher une liste d'achat selon votre selection, en plus en haut des bouttons qui vous permet d'enregistrer de nouveau poids d'un fournisseur  "
        break;
      default:
        text = "Je ne comprends pas... ?"
        break;
    }
    // Obtenir le contenu du texte

    // Utiliser l'API SpeechSynthesis pour lire le texte
    const syntheseVocale = window.speechSynthesis;
    const messageVocal = new SpeechSynthesisUtterance(text);
    syntheseVocale.speak(messageVocal);
  }

}
