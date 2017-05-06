var getData = function (){
    $.get("http://www.3-1leads.com/16-17.txt").done(function(response) {
         var allData = response.split('\n')
         var season = new Array;
         for(var item of allData){
             item = item.split(" ")
             if (item.length == 1 && item[0] != ""){
                 var subSeason = new Array;
                 subSeason.push(item[0].replace(/-/g, ""))
                 season.push(subSeason)
             } else if (item.length == 2){
                 var subSeason = new Array;
                 subSeason.push((item[0] + " " + item[1]).replace(/-/g, ""))
                 season.push(subSeason)
             } else {
                 var result = new Result(item[0] + " " + item[1] + " " + item[2],
                 item[3],
                 item[4],
                 item[5],
                 item[6])
                 season[season.length-1].push(result)
             }
         }

         for (var item of season[1]){
             console.log(item)
         }
         console.log(season)
    })
};

function Result(date, leadingTeam, result, score, trailingTeam){
    this.date = date;
    this.leadingTeam = leadingTeam;
    this.result = result;
    this.score = score;
    this.trailingTeam = trailingTeam;
}
