$(document).ready(function() {
    $.ajax({
        url: "http://www.3-1leads.com/seasons.txt",
        success: function(data) {
            var rows = data.split('\n');
            for (var season of rows) {
                if (season == "") return;
                var seasonData = season.split('|');
                var seasonYear = seasonData[0]
                seasonData.shift()
                var sidebarItemHeader = createSidebarHeader(seasonYear);
                var sidebarItemContent = createSidebarItems(seasonData);
                var sidebarList = document.getElementById("sidebarList");
                sidebarList.appendChild(sidebarItemHeader);
                sidebarList.appendChild(sidebarItemContent);
            }
        }
    });
});

var createSidebarHeader = function(seasonYear){
    var sidebarItem = document.createElement('li');
    var sidebarItemHeader = document.createElement('a');
    sidebarItemHeader.textContent = seasonYear;
    sidebarItemHeader.setAttribute('class', 'notlink sidebarHeader');
    sidebarItem.appendChild(sidebarItemHeader)
    return sidebarItem
}

var createSidebarItems = function(seasonData) {
    var sidebarItemContent = document.createElement('div');
    var childList = document.createElement('ul');
    childList.setAttribute('class', 'nav nav-sidebar');
    for (var dataSource of seasonData) {
        var dataParts = dataSource.split(',');
        var childListItem = document.createElement('li');
        var childListLink = document.createElement('a');
        childListLink.textContent = dataParts[0];
        childListLink.setAttribute('onClick', 'loadTable(\"' + dataParts[1] + '\")');
        childListItem.appendChild(childListLink);
        childList.appendChild(childListItem);
    }
    sidebarItemContent.appendChild(childList);
    return sidebarItemContent
}

var loadTable = function(value) {
    $.get(value)
    .done(function(response) {
        content.innerHTML = "";
        var season = parseResponse(response)
        for (var part of season) {
            var header = document.createElement('h3');
            header.textContent = part[0]
            header.setAttribute('class', 'highlight')
            content.appendChild(header)
            part.shift()
            makeStats(part)
            createTable(part)
        }
    })
};

var makeStats =  function(data) {
    var totalWins = new Array;
    var totalLosses = new Array;
    var blownLeadTeams = [];
    var comebackTeams = [];
    var keptTeams = [];
    var mostComebacks = 0;
    var mostBlownLeads = 0;
    var keptLeads = 0;
    var mostBlownLeadTeams = "";
    var mostComebackTeams = "";
    var mostKeptTeams = "";
    for (var result of data){
        if(result.result == "L"){
            totalLosses.push(result)
            blownLeadTeams[result.leadingTeam] = blownLeadTeams[result.leadingTeam] || 0
            blownLeadTeams[result.leadingTeam] += 1
            if (blownLeadTeams[result.leadingTeam] > mostBlownLeads){
                mostBlownLeads = blownLeadTeams[result.leadingTeam];
                mostBlownLeadTeams = result.leadingTeam
            } else if (blownLeadTeams[result.leadingTeam] == mostBlownLeads){
                mostBlownLeadTeams += ", " + result.leadingTeam
            }

            comebackTeams[result.trailingTeam] = comebackTeams[result.trailingTeam] || 0
            comebackTeams[result.trailingTeam] += 1
            if (comebackTeams[result.trailingTeam] > mostComebacks){
                mostComebacks = comebackTeams[result.trailingTeam];
                mostComebackTeams = result.trailingTeam
            } else if (comebackTeams[result.trailingTeam] == mostComebacks){
                mostComebackTeams += ", " + result.trailingTeam
            }
        } else {
            totalWins.push(result)
            keptTeams[result.leadingTeam] = keptTeams[result.leadingTeam] || 0
            keptTeams[result.leadingTeam] += 1
            if (keptTeams[result.leadingTeam] > keptLeads){
                keptLeads = keptTeams[result.leadingTeam];
                mostKeptTeams = result.leadingTeam
            } else if (keptLeads == keptTeams[result.leadingTeam]) {
                mostKeptTeams += ", " + result.leadingTeam
            }
        }
    }
    var retainedLeads = document.createElement('p')
    retainedLeads.innerHTML = "Total retained 3-1 leads: <span class='highlight'>" + totalWins.length + "</span>";
    content.appendChild(retainedLeads)
    var blownLeads = document.createElement('p')
    blownLeads.innerHTML = "Total blown 3-1 leads: <span class='highlight'>" + totalLosses.length + "</span>";
    content.appendChild(blownLeads)
    var percentage = document.createElement('p')
    percentage.innerHTML = "Percentage of blown 3-1 leads: <span class='highlight'>" + Math.round((totalLosses.length/totalWins.length)*10000)/100 + "%</span>";
    content.appendChild(percentage)
    if(mostComebacks != 0) {
        var teamBlownLeads = document.createElement('p')
        teamBlownLeads.innerHTML = "Team(s) with the most blown 3-1 leads: <span class='highlight'>" + mostBlownLeadTeams + " (" + mostBlownLeads + ")</span>";
        content.appendChild(teamBlownLeads)
        var teamComebacks = document.createElement('p')
        teamComebacks.innerHTML = "Team(s) with the most 3-1 comebacks: <span class='highlight'>" + mostComebackTeams + " (" + mostComebacks + ")</span>";
        content.appendChild(teamComebacks)
    }
    var keptLeadsContent = document.createElement('p')
    keptLeadsContent.innerHTML = "Team(s) with the most wins after a 3-1 lead: <span class='highlight'>" + mostKeptTeams + " (" + keptLeads + ")</span>";
    content.appendChild(keptLeadsContent)
}

var parseResponse = function(response) {
    var allData = response.split('\n')
    var season = new Array;
    for (var item of allData) {
        item = item.split(" ")
        if (item[0] == "" || item[0] == undefined) {
        } else if (item.length == 1) {
            var subSeason = new Array;
            subSeason.push(item[0].replace(/-/g, ""));
            season.push(subSeason);
        } else if (item.length == 2) {
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
            season[season.length - 1].push(result);
        }
    }
    return season;
}

var createTable = function(data) {
    var table = document.createElement('table');
    var tableHeader = document.createElement('tr');
    var td = document.createElement('th');
    td.textContent = "Date";
    td.setAttribute('class', 'highlight');
    var tl = document.createElement('th');
    tl.textContent = "Leading Team";
    tl.setAttribute('class', 'highlight');
    var tr = document.createElement('th');
    tr.textContent = "Result";
    tr.setAttribute('class', 'highlight');
    var ts = document.createElement('th');
    ts.textContent = "Score";
    ts.setAttribute('class', 'highlight');
    var tt = document.createElement('th');
    tt.textContent = "Trailing Team";
    tt.setAttribute('class', 'highlight');
    tableHeader.append(td);
    tableHeader.append(tl);
    tableHeader.append(tr);
    tableHeader.append(ts);
    tableHeader.append(tt);
    table.appendChild(tableHeader);
    for (result of data) {
        var row = document.createElement('tr');
        var rd = document.createElement('td');
        rd.textContent = result.date;
        rd.setAttribute('align', 'left');
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

function Result(date, leadingTeam, result, score, trailingTeam) {
    this.date = date;
    this.leadingTeam = leadingTeam;
    this.result = result;
    this.score = score;
    this.trailingTeam = trailingTeam;
}
