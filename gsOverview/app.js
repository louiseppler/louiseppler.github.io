new Vue({
    el:'#vue-app',
    data: {
      GS: false,
      GS1: true,
      GS2: true,
      Sci: true,
      Lit: true,
      descriptions: true,
    },
    methods: {
      toggleGS: function() {
        if(this.GS) {
          this.GS = false;
          this.GS1 = true;
          this.GS2 = true;
        }
        else {
          this.GS = true;
          this.GS1 = false;
          this.GS2 = false;
        }
      },
      toggleSci: function() {
        this.Sci = !this.Sci;
      },
      toggleLit: function() {
        this.Lit = !this.Lit;
      },
      toggleDescription: function() {
        console.log("Toggleing descriptions")
        this.descriptions = !this.descriptions;
      }


    }
});
