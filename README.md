# WordpressPosts

Instalacja:
- w folderze 'dist' znajduj� si� wszystkie pliki kt�re powinny trafi� na serwer WWW + folder zawiera pliki z testami jednostkowymi.

Testy jednostkowe:
- testy zosta�y przygotowane z u�yciem Jasmine i JSCover;
- aby uruchomi� test Jasmine nale�y uruchomi� plik /tests/SpecRunner.html;
- aby uruchomi� testy Coverage nale�y uruchomi� cmd przej�� do folderu '/tests' a nast�pnie wywo�a� 'jscover-server.bat', w razie gdyby port by� zaj�ty nale�y wyedytowa� plik i zmieni� na dost�pny port;
- je�li server JSCover jest uruchomiony nale�y przej�� na adres 'http://localhost:3123/jscoverage.html?tests/SpecRunner.html';