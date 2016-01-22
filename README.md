# WordpressPosts

Instalacja:
- aplikacja zosta�a stworzona w �rodowisku asp.net mvc silnik razor;
- do uruchomienia potrzeny jest Microsoft Visual Studio (wersja na ktr�rej pisa�em to 2012);
- po pobraniu projekty prosz� upewni� si� czy aplikacja ma prawid�owo ustawiony port;
- aktualny port znajduje si� w Web.config wpis:
	<add key="BaseSiteUrl" value="http://localhost:50195/" />
- w Visual studio nale�y nacin�� PPM na projekcie, wybra� 'Properties', przej�� do zak�adki Web w dzia�e zatytuowanym 'Servers' zaznaczy� 'Use Visual Studio Development Server' oraz 'Specific port' gdzie podajemy '50195';
- projekt jest gotowy do uruchomienia.

Testy jednostkowe:
- testy zosta�y przygotowane z u�yciem Jasmine i JSCover;
- aby uruchomi� test Jasmine nale�y uruchomi� plik /tests/SpecRunner.html;
- aby uruchomi� testy Coverage nale�y uruchomi� cmd przej�� do folderu '/tests' a nast�pnie wywo�a� 'jscover-server.bat', w razie gdyby port by� zaj�ty nale�y wyedytowa� plik i zmieni� na dost�pny port;
- je�li server JSCover jest uruchomiony nale�y przej�� na adres 'http://localhost:3123/jscoverage.html?tests/SpecRunner.html';