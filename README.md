# WordpressPosts

Instalacja:
- aplikacja zosta³a stworzona w œrodowisku asp.net mvc silnik razor;
- do uruchomienia potrzeny jest Microsoft Visual Studio (wersja na ktrórej pisa³em to 2012);
- po pobraniu projekty proszê upewniæ siê czy aplikacja ma prawid³owo ustawiony port;
- aktualny port znajduje siê w Web.config wpis:
	<add key="BaseSiteUrl" value="http://localhost:50195/" />
- w Visual studio nale¿y nacin¹œ PPM na projekcie, wybraæ 'Properties', przejœæ do zak³adki Web w dzia³e zatytuowanym 'Servers' zaznaczyæ 'Use Visual Studio Development Server' oraz 'Specific port' gdzie podajemy '50195';
- projekt jest gotowy do uruchomienia.

Testy jednostkowe:
- testy zosta³y przygotowane z u¿yciem Jasmine i JSCover;
- aby uruchomiæ test Jasmine nale¿y uruchomiæ plik /tests/SpecRunner.html;
- aby uruchomiæ testy Coverage nale¿y uruchomiæ cmd przejœæ do folderu '/tests' a nastêpnie wywo³aæ 'jscover-server.bat', w razie gdyby port by³ zajêty nale¿y wyedytowaæ plik i zmieniæ na dostêpny port;
- jeœli server JSCover jest uruchomiony nale¿y przejœæ na adres 'http://localhost:3123/jscoverage.html?tests/SpecRunner.html';