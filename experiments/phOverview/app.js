const { createApp } = Vue


//new Vue({
createApp({
    el:'#vue-app',
    //data: {
    mounted() {
      this.calculate();
    },
    data() {
      return {
      units: [
        { name: "*", letter: "*", formula: [0,0,0,0], formulaStr: "m^0*s^0*kg^0*c^0", unit: " ", unitStr: "*", },
        { name: "Distance", letter: "d", formula: [1,0,0,0], formulaStr: "m^1*s^0*kg^0*c^0", unit: "m", unitStr: "meter", },
        { name: "Time", letter: "t", formula: [0,1,0,0], formulaStr: "m^0*s^1*kg^0*c^0", unit: "s", unitStr: "seconds", },
        { name: "Velocity", letter: "v", formula: [1,-1,0,0], formulaStr: "m^1*s^-1*kg^0*c^0", unit: "m/s", unitStr: "meters per second", },
        { name: "Acceleration", letter: "a", formula: [1,-2,0,0], formulaStr: "m^1*s^-2*kg^0*c^0", unit: "m/s^2", unitStr: "-", },
        { name: "Area", letter: "A", formula: [2,0,0,0], formulaStr: "m^2*s^0*kg^0*c^0", unit: "m^2", unitStr: "meter squared", },
        { name: "Frequency", letter: "f", formula: [0,-1,0,0], formulaStr: "m^0*s^-1*kg^0*c^0", unit: "Hz", unitStr: "Hertz", },
        { name: "Volume", letter: "V", formula: [3,0,0,0], formulaStr: "m^3*s^0*kg^0*c^0", unit: "m^3", unitStr: "-", },
        { name: "Mass", letter: "m", formula: [0,0,1,0], formulaStr: "m^0*s^0*kg^1*c^0", unit: "kg", unitStr: "Kilogram", },
        { name: "Force", letter: "F", formula: [1,-2,1,0], formulaStr: "m^1*s^-2*kg^1*c^0", unit: "N", unitStr: "Newton", },
        { name: "Torque", letter: "τ", formula: [2,-2,1,0], formulaStr: "m^2*s^-2*kg^1*c^0", unit: "N*m", unitStr: "-", },
        { name: "Work", letter: "W", formula: [2,-2,1,0], formulaStr: "m^2*s^-2*kg^1*c^0", unit: "J", unitStr: "Joules", },
        { name: "Power", letter: "P", formula: [2,-3,1,0], formulaStr: "m^2*s^-3*kg^1*c^0", unit: "W", unitStr: "Watt", },
        { name: "Momentum", letter: "p", formula: [1,-1,1,0], formulaStr: "m^1*s^-1*kg^1*c^0", unit: "Ns", unitStr: "-", },
        { name: "Density", letter: "ρ", formula: [-3,0,1,0], formulaStr: "m^-3*s^0*kg^1*c^0", unit: "Kg/m^3", unitStr: "-", },
        { name: "Pressure", letter: "p", formula: [-1,-2,1,0], formulaStr: "m^-1*s^-2*kg^1*c^0", unit: "Pa", unitStr: "Pascal", },
        { name: "Charge", letter: "Q", formula: [0,0,0,1], formulaStr: "m^0*s^0*kg^0*c^1", unit: "c", unitStr: "Coulomb", },
        { name: "Electric Field Strength", letter: "E", formula: [1,-2,1,-1], formulaStr: "m^1*s^-2*kg^1*c^-1", unit: "N/C", unitStr: "-", },
        { name: "Voltage", letter: "U", formula: [2,-2,1,-1], formulaStr: "m^2*s^-2*kg^1*c^-1", unit: "V", unitStr: "Volt (J/C)", },
        { name: "Current", letter: "I", formula: [0,-1,0,1], formulaStr: "m^0*s^-1*kg^0*c^1", unit: "A", unitStr: "Ampere (C/s)", },
        { name: "Number of cunduction electrons", letter: "n", formula: [-3,0,0,0], formulaStr: "m^-3*s^0*kg^0*c^0", unit: "-", unitStr: "-", },
        { name: "Resistance", letter: "R", formula: [2,-1,1,-2], formulaStr: "m^2*s^-1*kg^1*c^-2", unit: "Ω", unitStr: "Ohm", },
        { name: "Magnetic Field", letter: "B", formula: [0,-1,1,-1], formulaStr: "m^0*s^-1*kg^1*c^-1", unit: "T", unitStr: "Tesla", },
        { name: "Electrical Inductance", letter: "L", formula: [2,0,1,-2], formulaStr: "m^2*s^0*kg^1*c^-2", unit: "H", unitStr: "Henry", },
        { name: "Electrical Capacitance", letter: "C", formula: [2,-2,1,-2], formulaStr: "m^2*s^-2*kg^1*c^-2", unit: "F", unitStr: "Farad", },
        { name: "Magnetic Flux", letter: "Φ", formula: [0,-1,1,-1], formulaStr: "m^0*s^-1*kg^1*c^-1", unit: "Tm^2", unitStr: "Tm^2 or Vs", },
                  ],
        display: [],
        originTF: "_00_00_00_00",
        axisTFs: ["_01_00_00_00","_00_-1_00_00","_00_00_01_00","_00_00_00_01"],
        zAxisActive: true,
        wAxisActive: true,
        current: 0,
        showAll: false,
                }
    },
    methods: {
      calculate: function() {
        // function compare(origin, unit1, d1, unit2, d2, unit3) {
        //   // console.log(unit1.m,d,unit2.m,"**",unit1.m*d,(unit1.m*d != unit2.m));
        //   if(unit1.m*d1+origin.m+unit2.m*d2 != unit3.m) { return false; }
        //   if(unit1.s*d1+origin.s+unit2.s*d2 != unit3.s) { return false; }
        //   if(unit1.kg*d1+origin.kg+unit2.kg*d2 != unit3.kg) { return false; }
        //   if(unit1.c*d1+origin.c+unit2.c*d2 != unit3.c) { return false; }
        //   return true;
        // }

        function  compare(origin, shifts, axis, unit) {
          result = [0,0,0,0];
          for(i in origin) {
            result[i] = origin[i];
          }

          for(j in axis) {
            for(i in result) {
              result[i] += axis[j][i]*shifts[j];
            }
          }

          for(i in result) {
            if(result[i] != unit[i]) {
              return false;
            }
          }

          return true;
        }

        function getUnit(text, units) {
          console.log("converting:",text);
          result = [0,0,0,0];
          if(text[0] == "_") {
            m = parseInt(text.substring(1,3))
            s = parseInt(text.substring(4,6))
            kg = parseInt(text.substring(7,9))
            c = parseInt(text.substring(10,12))
            result =[m,s,kg,c];
          }
          else if(text.substring(0,2) == "1/"){
            for(unit of units) {
              if(unit.letter == text.substring(2)) {
                for(i in unit.formula) {
                  result[i] = -unit.formula[i];
                }
                // result = unit.formula;
              }
            }
          }
          else {
            for(unit of units) {
              if(unit.letter == text) {
                for(i in unit.formula) {
                  result[i] = unit.formula[i];
                }
                // result = unit.formula;
              }
            }
          }

          return result;
        }

        //====================================================================================

        console.log("calculating");

        this.display = [];

        shifts = [-3,-3,0,0];
        maxs = [4,4,1,1];

        if(this.zAxisActive) {
          shifts[2] = -1;
          maxs[2] = 2;
        }
        if(this.wAxisActive) {
          shifts[3] = -1;
          maxs[3] = 2;
        }

        if(this.showAll) {
          shifts[2] = -2;
          maxs[2] = 3;
          shifts[3] = -2;
          maxs[3] = 3;
        }


        for(x = shifts[0]; x < maxs[0]; x++){
          xloc = []
          for(y = shifts[1]; y < maxs[1]; y++) {
            yloc = []
            for(z = shifts[2]; z < maxs[2]; z++){
              zloc = []
              for(w = shifts[3]; w < maxs[3]; w++) {
                zloc.push(-1)
              }
              yloc.push(zloc)
            }
            xloc.push(yloc)
          }
          this.display.push(xloc)
        }

        axis = [null, null, null, null]
        for(i in axis) {
          axis[i] = getUnit(this.axisTFs[i], this.units);
          console.log(axis[i])
        }
        origin = getUnit(this.originTF, this.units);

        for(i in this.units) {
          unit = this.units[i];
          ii = i;
          for(x = shifts[0]; x < maxs[0]; x++){
            for(y = shifts[1]; y < maxs[1]; y++) {
              for(z = shifts[2]; z < maxs[2]; z++){
                for(w = shifts[3]; w < maxs[3]; w++) {
                  if(compare(origin, [x,y,z,w], axis, unit.formula)) {
                    console.log(unit.name);
                    this.display[y-shifts[1]][x-shifts[0]][z-shifts[2]][w-shifts[3]] = ii;
                  }
                }
              }
            }
          }
        }

        console.log("done");

      },
      toggleZAxis: function() {
        this.zAxisActive = !this.zAxisActive;
      },
      toggleWAxis: function() {
        this.wAxisActive = !this.wAxisActive;
      },
      getDisplay: function(ref) {
        if(ref == -1) {return;}
        return this.units[ref].letter;
      },
      changeTo: function(i) {
        if(i == -1) {return;}
        this.current = i;
      },
      toggleShowAll: function() {
        this.showAll = !this.showAll
      }
    },
}).mount('#vue-app');
