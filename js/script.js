$(document).ready(function(){
    $.ajax({
      url: "http://www.3-1leads.com/seasons.txt",
      success: function(data){
          var rows = data.split('\n');
          for (var link of rows){
              if (link == "") return;
              var splitLink = link.split('|');
              var sidebar = document.getElementById("somethingObvious");
              var element = document.createElement('li');
              element.setAttribute('class','nav-sidebar-secondary ')
              var link = document.createElement('a');
              link.textContent = splitLink[0];
              link.setAttribute('onClick', 'refreshTable(\"'+splitLink[1]+'\")');
              element.appendChild(link);
              sidebar.appendChild(element);
          }
      }
    });
});

var refreshTable = function(value){
    $.get(value)
    .done(function(response) {
        var contentDiv = document.getElementById('content');
        contentDiv.innerHTML = "";
         var allData = response.split('\n')
         var season = new Array;
         for(var item of allData){
             item = item.split(" ")
             if(item[0] == "" || item[0] == undefined){

             } else if (item.length == 1){
                 var subSeason = new Array;
                 subSeason.push(item[0].replace(/-/g, ""));
                 season.push(subSeason);
             } else if (item.length == 2){
                 var subSeason = new Array;
                 subSeason.push((item[0] + " " + item[1]).replace(/-/g, ""));
                 season.push(subSeason);
             } else {
                 var month = item[0].toLowerCase()
                 month = month[0].toUpperCase() + month.slice(1)
                 var result = new Result(month + " " + item[1] + " " + item[2],
                 item[3],
                 item[4],
                 item[5],
                 item[6]);
                 season[season.length-1].push(result);
             }
         }

         for (var part of season){
             var header = document.createElement('h3');
             header.textContent = part[0]
             content.appendChild(header)
             part.shift()
             createTable(part, content)
         }
    })
};

var createTable = function(data, content){
    var table = document.createElement('table');
    // table.setAttribute('cellspacing', '10')
    var tableHeader = document.createElement('tr');
    var td = document.createElement('th');
    td.textContent = "Date";
    var tl = document.createElement('th');
    tl.textContent = "Leading Team";
    var tr = document.createElement('th');
    tr.textContent = "Result";
    var ts = document.createElement('th');
    ts.textContent = "Score";
    var tt = document.createElement('th');
    tt.textContent = "Trailing Team";
    tableHeader.append(td);
    tableHeader.append(tl);
    tableHeader.append(tr);
    tableHeader.append(ts);
    tableHeader.append(tt);
    table.appendChild(tableHeader);
    for (result of data){
        var row = document.createElement('tr');
        var rd = document.createElement('td');
        rd.textContent = result.date;
        rd.setAttribute('align', 'right');
        var rl = document.createElement('td');
        rl.textContent = result.leadingTeam;
        rl.setAttribute('align', 'right');
        var rr = document.createElement('td');
        rr.textContent = result.result;
        rr.setAttribute('align', 'right');
        var rs = document.createElement('td');
        rs.textContent = result.score;
        rs.setAttribute('align', 'right');
        var rt = document.createElement('td');
        rt.textContent = result.trailingTeam;
        rt.setAttribute('align', 'right');
        row.append(rd);
        row.append(rl);
        row.append(rr);
        row.append(rs);
        row.append(rt);
        table.appendChild(row);
    }
    content.appendChild(table)
}

function Result(date, leadingTeam, result, score, trailingTeam){
    this.date = date;
    this.leadingTeam = leadingTeam;
    this.result = result;
    this.score = score;
    this.trailingTeam = trailingTeam;
}
