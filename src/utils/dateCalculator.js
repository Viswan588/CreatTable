export const minDate = (inputDate) => {
    console.log('min',inputDate);
    if(inputDate){

    }

};

export const maxDate = (inputDate) =>{
    console.log('max',inputDate);
    if(inputDate){
        
    }
};

export const titleCase = (str) => {
    var splitStr = str.toLowerCase().split('_');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

 export const numberWithCommasAmount = (x) => {
    return x ?  '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}

export const numberWithCommas = (x) => {
    return  x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}