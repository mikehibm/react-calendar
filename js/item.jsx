class Item {
    
    constructor(id, date, time, text){
        this.id = id;
        this.date = date;
        this.time = time;
        this.text = text;
    }
    
    valiate(){
        if (!this.text){
            return 'Please input a text.';
        }
        return '';
    }
}

module.exports = Item; 