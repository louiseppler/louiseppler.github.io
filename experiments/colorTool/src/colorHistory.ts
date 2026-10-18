export class ColorHistory {

    states: string[][] = [];
    index = -1;

    public addState(value: string[]) {
        console.log("Adding State");

        if(this.states.length-1 != this.index) {
            this.states = this.states.slice(0, this.index + 1);
        }

        this.states.push(value);
        this.index += 1;

        this.logState();
        return;

        if(this.states.length == 0 || this.states[this.states.length-1] != value) {
            this.states.push(value);
            this.index += 1;
        }
    }

    public undo() {
        console.log("Undo Called");

        
        if(this.index > 0) {
            this.index -= 1;
        }
        console.log("at index " + this.index);
       
        this.logState();
        return this.states[this.index];

    }

    public redo() {
        console.log("Redo Called");
        

        if(this.index < this.states.length-1) {
            this.index += 1;
        }
        console.log("at index " + this.index);

        this.logState();
        return this.states[this.index];
    }

    private logState() {
       // console.log(this.index + " with #" + this.states.length + "states");
    }
}