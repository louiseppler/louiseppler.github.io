export enum ShapeType {
    Thermometer,
    Radar,
    CustomRadar,
    CustomPath
}

export function getMessages(type: ShapeType) {
    switch(type) {
        case ShapeType.Thermometer:
            return ["Set Start", "Set Finish"];
        case ShapeType.Radar:
            return ["Set Center"];
        case ShapeType.CustomRadar:
            return ["Set Center", "Set Distance Point"];
        case ShapeType.CustomPath:
            var msgs = [];
            for(var i = 0; i < 15; i++) {
                msgs.push("Set Custom Point")
            }
            return msgs;
    }
}