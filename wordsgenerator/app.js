new Vue({
    el:'#vue-app',
    data: {
      started: false,
      n: 9,
      count: 0,
      word1: "New Word",
      word2: "New Word",
      word3: "New Word",
      word4: "New Word",
      word5: "New Word",
      words: ['Kloster', 'Maske', 'Waschmaschine', 'Händler', 'Stereo', 'Wohnung', 'Verlangen', 'Gewichte', 'Steigen', 'Batterie', 'Sport', 'Einschalten', 'Erdbeben', 'Wächter', 'Schüler', 'Akne', 'Armband', 'Unternehmen', 'Hemisphären', 'Genius', 'Treibstoff', 'Zauberer', 'Fütterung', 'Silber', 'Sanduhr', 'Kaufhaus', 'Schatz', 'Schraubendreher', 'Chirurgie', 'Eiffelturm', 'Entführen', 'Beifall', 'Schützen', 'Scharf', 'Kosmetik', 'Elefant', 'Spoiler', 'Hergeben', 'Ewigkeit', 'Alarm', 'Schneemann', 'Bedeutung suchen in:', 'Kastanienbraun', 'Predigt', 'Stoff', 'Klee', 'Slip', 'Niederlage', 'Pest', 'Finnland', 'Erotik', 'Bleibe', 'Bedeutung suchen in:', 'Schmiermittel', 'Ratte', 'Brief', 'Förderer', 'Fütterung', 'Blumenkohl', 'Tango', 'Minirock', 'Symphonie', 'Bleibe', 'Bedeutung suchen in:', 'Schmiermittel', 'Ratte', 'Brief', 'Förderer', 'Fütterung', 'Blumenkohl', 'Tango', 'Minirock', 'Symphonie', 'Faden', 'Wendekreis', 'Japanisch', 'Anschovis', 'Boden', 'Taub', 'Saat', 'Muschel', 'Anwalt', 'Kaulquappe', 'Wange', 'Natur', 'Pochen', 'Fluor', 'Gießen', 'Horn', 'Gag', 'Aufteilung', 'Briefmarken', 'Kelle'],
    },
    methods: {
      pressed1: function() {
        r = Math.floor(Math.random()*this.words.length)
        this.word1 = this.words[r]
        this.count += 1
      },
      pressed2: function() {
        r = Math.floor(Math.random()*this.words.length)
        this.word2 = this.words[r]
        this.count += 1
      },
      pressed3: function() {
        r = Math.floor(Math.random()*this.words.length)
        this.word3 = this.words[r]
        this.count += 1
      },
      pressed4: function() {
        r = Math.floor(Math.random()*this.words.length)
        this.word4 = this.words[r]
        this.count += 1
      },
      pressed5: function() {
        r = Math.floor(Math.random()*this.words.length)
        this.word5 = this.words[r]
        this.count += 1
      },
      start: function() {

        this.pressed1()
        this.pressed2()
        this.pressed3()
        this.pressed4()
        this.pressed5()
        this.count = 0
        this.started = true
      }


    }
});
