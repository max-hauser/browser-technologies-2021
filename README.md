# Browser Technologies @cmda-minor-web 20-21
![afbeelding van project](https://github.com/max-hauser/browser-technologies-2021/blob/master/README-IMAGES/nieuw-ontwerp.png)
***
### live link
[link naar live webapp](https://tshirtshine.herokuapp.com/)

### Inhoudsopgave:
* [!#over-het-vak](Over het vak)
* Gekozen opdracht
* Hoofdfunctionaliteit
* Progressive Enhancement
* * Functional laag
* * Usable laag
* * Pleasureable laag
* Web technologie
* * File API
* * Drag & Drop
* Browser test
* Hoe te installeren

***

### Over het vak

In het vak Browser Technologies ga ik onderzoeken wat Progressive Enhancement is en hoe ik dit kan toepassen om een goede, robuuste en toegankelijke website te maken.

### Gekozen opdracht

Als website onderwerp heb ik gezoken voor het maken van een website dat de bezoeker instaat stelt om een eigen t-shirt te ontwerpen. De gebruiker kan zelf tekst toevoegen, eventueel een afbeelding toevoegen, deze verplaatsen en de tekst opmaken. Dit wordt vervolgens opgeslagen in een database, zodat de gebruiker later nog een keer het ontwerp kan terugzien/bewerken.

### Hoofdfunctionaliteit

De hoofdfunctionaliteit is dat iedere gebruiker in zoveel mogelijk verschillende browsers en apparaten een eigen shirt kan ontwerpen, vervolgens het ontwerp kan opslaan, bestellen en de volgende keer dat de gebruiker terug komt het ontwerp te kunnen terugzien/aanpassen.

#### Wireflow

Als eerste heb ik een wireflow van de webapp gemaakt, om te kijken hoe de webapp in elkaar zal steken.

![Wireflow van project](https://github.com/max-hauser/browser-technologies-2021/blob/master/README-IMAGES/nieuw-wireflow.png)

### Progressive Enhancement

Om ervoor te zorgen dat iedere gebruiker de webapp kan gebruiken is het belangrijk om het design-principe 'Progressive Enhancement' (PE) in gebruik te nemen.

Progressive Enhancement is een manier van denken, waarbij je begint bij een sterke basis, die het altijd doet. Vandaar uit
bouw je verder en maak je de ervaring beter en beter.

PE bestaat uit 3 lagen:
1. Functional laag
2. Usable laag
3. Pleasureable laag

#### Functional laag
Je begint bij een puur functionele laag. In deze context is dat een html pagina waarbij de relevante informatie goed leesbaar is en de hoofddoel behaald kan worden. (Dit is te zien bij alfbeelding 1 en linker afbeelding). In deze laag staat de html op een manier geordend dat het voor de gebruiker overzichtelijk is uit welke onderdelen het formulier bestaat. De gebruiker kan op de knop updaten klikken waarna het formulier wordt opgeslagen in een sessie zodat de instellingen bewaard blijven. Als de gebruiker tevreden is kan er op de bestellen-knop worden geklikt om het definitief op te slaan in een database.

#### Useable laag
Als de funcional laag goed staat kan de volgende laag worden toegevoegd. Deze laag is de usable laag. In deze laag wordt de functionaliteit uitgebreidt waardoor de gebruikerservaring wordt verbeterd. In dit geval wordt er met css de opmaak van de pagina verbeterd zodat de gebruiker duidelijk kunt zien wat de veranderingen zijn op het t-shirt waarneer de update knop wordt ingedrukt. (dit kan je zien op afbeelding 1 rechtsboven)

#### Pleasurable laag
Om de gebruikerservaring af te maken kunnen de functionaleiten uitgebreidt worden door middel van Javascript. Ik heb meerdere API's toegevoegd zodat de gebruiker zonder de update knop de data over de t-shirt wordt ge-update en dat de afbeelding en de tekst kunnen worden versleept op het t-shirt. Deze extra functionaliteiten kunnen worden toegevoegd door extra web technologie API's. (dit kan je zien op afbeelding 1 rechtsonder)

#### Afbeelding 1
![afbeelding van project](https://github.com/max-hauser/browser-technologies-2021/blob/master/README-IMAGES/nieuw-PE.png)

### Web technologie

Om de gebruikerservaring uit te breiden heb ik gebruik gemaakt van 2 web technologiën:
1. File API
2. Drag & Drop API

Met de File API kan ik ervoor zorgen dat de gebruiker een bestand (in dit geval alleen afbeeldingen) kan uploaden naar de pagina. Hierdoor kan de gebruiker het t-shirt design meer eigen maken door zelf een afbeelding toe te voegen.

Het is belangrijk dat deze functionaliteit goed werkt op zoveel mogelijk browsers. Ik heb gekeken hoe goed deze functionaliteit wordt ondersteund door browsers met behulp van de website caniuse.com. Het resultaat staat hieronder in afbeelding 2. Mocht de functionaliteit niet worden ondersteund, dan krijgt de gebruiker een bericht te zien dat de functionaliteit niet wordt ondersteund en dat de gebruiker alsnog een afbeelding kan mailen om ervoor te zorgen dat het alsnog geprint kan worden.

#### Afbeelding 2
![File Reader API](https://github.com/max-hauser/browser-technologies-2021/blob/master/README-IMAGES/filereader.png)

Ik heb het zelfde gedaan met het Drag & Drop systeem. Mocht dit niet worden ondersteund, dan komt er een keuzeveld waarbij de gebruiker kan aangeven op welke positie de tekst/afbeelding moet komen te staan, zodat het alsnog duidelijk is wat de gebruiker wil. Op afbeelding 3 is het resultaat van de caniuse over Drag & Drop API te zien.

### Afbeelding 3
![drag and drop API](https://github.com/max-hauser/browser-technologies-2021/blob/master/README-IMAGES/draganddrop.png)


### Browser tests

#### Getest op de browsers
* Google Chrome
* Firefox
* Safari IOS (mobiel)
* Samsung browser (mobiel)

### Install guide
* ``` git clone git@github.com:max-hauser/browser-technologies-2021.git```
* install live-server plugin bij vs-code
* openen met live-server

### Opdracht 1 🛹 NPM install Progressive- enhancement

[link naar opdracht 1](https://max-hauser.github.io/browser-technologies-2021/Opdracht1/index.html)

### Opdracht 2 💔 Breek het Web

[link naar opdracht 2](https://github.com/max-hauser/browser-technologies-2021/wiki/Opdracht-2:-Breek-het-web)
