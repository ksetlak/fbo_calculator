# **Specyfikacja Techniczna i Produktowa PoC: Kalkulator Obligacji Skarbowych ("Starcie z Inflacją")**

## **1. Kontekst i Cel Biznesowy**

**Cel:** Zbudowanie pierwszego elementu ekosystemu narzędzi finansowych – Kalkulatora Obligacji Skarbowych (na przykładzie 4-letnich COI).  
**Problem:** Istniejące kalkulatory są zbyt techniczne. Nasz odbiorca to osoba początkująca ("Kowalski"), która nigdy nie inwestowała.  
**Rozwiązanie:** Ekstremalnie prosty interfejs (3 suwaki) prowadzący do "Aha! Moment" – wizualnego udowodnienia, że trzymanie gotówki w dobie inflacji to strata, lokata ledwie spowalnia ten proces, a obligacje chronią kapitał.

## **2. Architektura i Stack Technologiczny**

Zgodnie z wymogiem hostowania jako statycznej strony na GitHub Pages (hiper-prosty deployment), stack technologiczny musi zostać dostosowany do generowania plików statycznych.

* **Framework:** Next.js (wersja App Router lub Pages Router) **z wymuszoną opcją Static HTML Export** (output: 'export' w next.config.js). Alternatywnie: React + Vite (jako SPA).  
* **Język:** TypeScript (ścisłe typowanie funkcji matematycznych to priorytet).  
* **Styling:** Tailwind CSS (mobile-first, responsywność).  
* **Wykresy:** Recharts (lekka biblioteka, łatwa customizacja pod RWD).  
* **Hosting:** GitHub Pages (Repozytorium -> Settings -> Pages -> Deploy from branch: gh-pages lub main/docs).

## **3. Wymagania UI/UX (Odbiorca: Początkujący)**

1. **Zasada "No-Jargon":** Unikamy trudnych słów bankowych tam, gdzie to możliwe. Zamiast "Stopa referencyjna", używamy "Oprocentowanie lokaty".  
2. **Mobile-First & Desktop-Rich:** * Na smartfonach: Wykres główny musi być czytelny (ewentualnie ukrycie legendy lub tooltipy na tapnięcie), suwaki łatwe w obsłudze kciukiem. Wymagane sticky-cards z wynikami na dole ekranu.  
   * Na desktopie: Wykres i suwaki widoczne w trybie side-by-side (2 kolumny) dla natychmiastowego feedbacku wizualnego przy przesuwaniu suwaków.  
3. **Natychmiastowa Reakcja:** Przesunięcie suwaka musi *w czasie rzeczywistym* (bez przeładowania strony, ew. z lekkim debouncem 50ms) aktualizować wykres i karty wyników.

## **4. Zakres Funkcjonalny (User Interface)**

### **4.1. Sekcja Wejściowa (Zmienne Użytkownika)**

Komponenty typu Slider (suwak) z podpiętym obok polem input type="number" dla precyzyjnego wpisania wartości.

| Parametr | Zmienna w kodzie | Wartość domyślna | Min | Max | Krok (Step) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Kwota oszczędności | initialCapital | 10 000 zł | 1 000 zł | 1 000 000 zł | 1 000 zł |
| Średnia inflacja | expectedInflation | 5.0% | 0.0% | 20.0% | 0.1% |
| Oprocentowanie lokaty | depositRate | 4.0% | 0.0% | 15.0% | 0.1% |

### **4.2. Sekcja "Ustawienia Zaawansowane" (Ukryte / Collapsible)**

Sekcja domyślnie zwinięta (np. komponent Accordion), aby nie straszyć początkujących.

| Parametr | Zmienna w kodzie | Wartość domyślna |
| :---- | :---- | :---- |
| Oprocentowanie obligacji w 1. roku | bondFirstYearRate | 6.5% |
| Marża obligacji (lata 2-4) | bondMargin | 1.25% |
| Podatek Belki | taxRate | 19.0% |

## **5. Logika Biznesowa (Algorytmy i Obliczenia)**

Developer musi utworzyć serwis/funkcję (np. calculateScenarios(inputs): Array<ChartData>), która dla każdego z 4 lat (oraz roku 0) zwróci wartości netto kapitału. Horyzont czasowy jest sztywny: **4 lata**.  
*Definicje bazowe:*  
K = initialCapital

### **Scenariusz A: Skarpeta / Konto 0%**

* Wartość nominalna przez cały okres wynosi K.  
* *Opcjonalnie dla wykresu (do decyzji biznesowej, tu definiujemy podwaliny):* Wartość realna z każdym rokiem spada według wzoru: ![][image1]. Dla uproszczenia pierwszego PoC na głównym wykresie pokazujemy wartość nominalną (płaska linia = 0 zysku).

### **Scenariusz B: Lokata Bankowa (Kapitalizacja roczna)**

Zysk podlega opodatkowaniu co roku. Pieniądze procentują.

* **Rok 0:** K  
* **Rok 1..4 (pętla):**  
  * OdsetkiBrutto = V_{n-1} * depositRate  
  * OdsetkiNetto = OdsetkiBrutto * (1 - taxRate)  
  * V_n = V_{n-1} + OdsetkiNetto

### **Scenariusz C: Obligacje Skarbowe 4-letnie (COI)**

Specyfika: Odsetki kapitalizują się co roku (powiększają kapitał pracujący w kolejnym roku), ale **podatek pobierany jest dopiero na samym końcu (po 4 latach)** od łącznej sumy wypracowanych odsetek.

* **Rok 0:** V_0 = K  
* **Rok 1:** * Rate_1 = bondFirstYearRate  
  * OdsetkiBrutto_1 = K * Rate_1  
  * V_1 = K + OdsetkiBrutto_1 (na potrzeby obliczeń kolejnego roku)  
* **Rok 2, 3 i 4 (pętla dla n=2,3,4):**  
  * Rate_n = expectedInflation + bondMargin  
  * OdsetkiBrutto_n = V_{n-1} * Rate_n  
  * V_n = V_{n-1} + OdsetkiBrutto_n  
* **Rozliczenie końcowe (po 4 roku):**  
  * SumaOdsetekBrutto = OdsetkiBrutto_1 + OdsetkiBrutto_2 + OdsetkiBrutto_3 + OdsetkiBrutto_4  
  * Podatek = SumaOdsetekBrutto * taxRate  
  * **Ostateczny wynik netto po 4 latach:** WynikObligacji = K + SumaOdsetekBrutto - Podatek

## **6. Prezentacja Danych (Output)**

### **6.1. Wykres Główny (Recharts)**

Zalecany typ: LineChart lub AreaChart (obszarowy lepiej pokazuje rosnącą różnicę/masę kapitału).

* **Oś X:** Lata (0, 1, 2, 3, 4).  
* **Oś Y:** PLN (formatowane z separatorem tysięcy, np. "12 000 zł").  
* **Serie danych (3 linie):**  
  1. Skarpeta (kolor szary/neutralny)  
  2. Lokata (kolor pomarańczowy/niebieski - umiarkowany)  
  3. Obligacje (kolor zielony/brandowy - wyraźnie dominujący, idący w górę)  
* **Wymóg:** Wykres musi animować się płynnie podczas przesuwania suwaków.

### **6.2. Karty Podsumowujące (Cards)**

Trzy wyraźne kafelki pod wykresem wyświetlające wynik **po 4 latach na rękę**:

1. **Gotówka (Skarpeta)**  
   * Duża kwota: [Wynik] zł  
   * Sub-text: "0 zł zysku"  
2. **Lokata w banku**  
   * Duża kwota: [Wynik Lokaty] zł  
   * Sub-text: "+ [Zysk Netto] zł zysku"  
3. **Obligacje (COI)** - *Ta karta powinna być wyróżniona wizualnie (np. obramowanie, cień, ikona korony/tarczy).*  
   * Duża kwota: [Wynik Obligacji] zł  
   * Sub-text: "+ [Zysk Netto] zł zysku"

### **6.3. UX Copy (Wiadomość z "Aha! Moment")**

Poniżej kart musi renderować się dynamiczny tekst. Zmienne wstawiane z kodu:

* X = Wynik Obligacji - Wynik Lokaty  
* Y = Wynik Obligacji - Skarpeta

**Szablon:**  
*"Wybierając obligacje, po 4 latach zyskujesz na rękę o **[X] zł** więcej niż na zwykłej lokacie, i aż o **[Y] zł** więcej niż trzymając gotówkę w skarpecie. Skutecznie chronisz swoje oszczędności przed wzrostem cen."*

## **7. Definition of Done (DoD) dla PoC**

1. Aplikacja kompiluje się do statycznych plików bez błędów (next build && next export).  
2. Deployment na GitHub Pages działa prawidłowo i jest dostępny publicznie.  
3. Suwaki aktualizują stan aplikacji natychmiastowo.  
4. Wyliczenia matematyczne zgadzają się z oficjalną logiką obligacji COI (błąd zaokrągleń max do 1 grosza).  
5. Aplikacja nie posiada pionowego scrolla na głównym ekranie na desktopie (wszystko mieści się "above the fold").  
6. Aplikacja wygląda prawidłowo i jest w pełni używalna na urządzeniach mobilnych (iPhone SE, iPhone 14/15, Android).  
7. Zero błędów i warningów w konsoli przeglądarki.
