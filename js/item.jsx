class Item {
    
    constructor(id, date, time, text, synced){
        this.id = id;
        this.date = date;
        this.time = time;
        this.text = text;
        this.synced = synced || false;
    }
    
    valiate(){
        if (!this.text){
            return 'Please input a text.';
        }
        return '';
    }
}

module.exports = Item; 