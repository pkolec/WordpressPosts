# WordpressPosts

Instalacja:
- w folderze 'dist' znajduj¹ siê wszystkie pliki które powinny trafiæ na serwer WWW + folder zawiera pliki z testami jednostkowymi.

Testy jednostkowe:
- testy zosta³y przygotowane z u¿yciem Jasmine i JSCover;
- aby uruchomiæ test Jasmine nale¿y uruchomiæ plik /tests/SpecRunner.html;
- aby uruchomiæ testy Coverage nale¿y uruchomiæ cmd przejœæ do folderu '/tests' a nastêpnie wywo³aæ 'jscover-server.bat', w razie gdyby port by³ zajêty nale¿y wyedytowaæ plik i zmieniæ na dostêpny port;
- jeœli server JSCover jest uruchomiony nale¿y przejœæ na adres 'http://localhost:3123/jscoverage.html?tests/SpecRunner.html';