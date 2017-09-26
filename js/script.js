$(document).ready(function() {
    $.ajax({
        url: "http://www.3-1leads.com/SeasonDirectory.txt",
        success: function(data) {
            var rows = data.split('\n');
            for (var season of rows) {
                if (season == "") return hashChange();
                var seasonData = season.split('|');
                var seasonYear = seasonData[0]
                seasonData.shift()
                var sidebarItemHeader = createSidebarHeader(seasonYear);
                var sidebarItemContent = createSidebarItems(seasonYear, seasonData);
                var sidebarList = document.getElementById("sidebarList");
                sidebarList.appendChild(sidebarItemHeader);
                sidebarList.appendChild(sidebarItemContent);
            }
        }
    });
});
var allTeams = {
    ['AFM'] : 'Atlanta Flames',
    ['ANA'] : 'Anaheim Ducks',
    ['ARI'] : 'Arizona Coyotes',
    ['ATL'] : 'Atlanta Thrashers',
    ['BOS'] : 'Boston Bruins',
    ['BUF'] : 'Buffalo Sabres',
    ['CGY'] : 'Calgary Flames',
    ['CAR'] : 'Carolina Hurricanes',
    ['CHI'] : 'Chicago Blackhawks',
    ['CBJ'] : 'Columbus Blue Jackets',
    ['COL'] : 'Colorado Avalanche',
    ['CLR'] : 'Colorado Rockies',
    ['DAL'] : 'Dallas Stars',
    ['DCG'] : 'Detroit Cougars',
    ['DET'] : 'Detroit Red Wings',
    ['EDM'] : 'Edmonton Oilers',
    ['FLA'] : 'Florida Panthers',
    ['HFD'] : 'Hartford Whalers',
    ['LAK'] : 'Los Angeles Kings',
    ['MIN'] : 'Minnesota Wild',
    ['MNS'] : 'Minnesota North Stars',
    ['MMR'] : 'Montreal Maroons',
    ['MTL'] : 'Montreal Canadiens',
    ['NSH'] : 'Nashville Predators',
    ['NJD'] : 'New Jersey Devils',
    ['NYA'] : 'New York Americans',
    ['NYI'] : 'New York Islanders',
    ['NYR'] : 'New York Rangers',
    ['OAK'] : 'Oakland Seals',
    ['OTT'] : 'Ottawa Senators',
    ['SEN'] : 'Ottawa Senators (1917)',
    ['PHI'] : 'Philadelphia Flyers',
    ['PHX'] : 'Pheonix Coyotes',
    ['PIT'] : 'Pittsburgh Penguins',
    ['PIR'] : 'Pittsburgh Pirates',
    ['QUE'] : 'Quebec Nordiques',
    ['SJS'] : 'San Jose Sharks',
    ['SEA'] : 'Seattle Metropolitans',
    ['STL'] : 'St. Louis Blues',
    ['TBL'] : 'Tampa Bay Lightning',
    ['TAN'] : 'Toronto Arenas',
    ['TOR'] : 'Toronto Maple Leafs',
    ['TSP'] : 'Toronto St. Pats',
    ['VAN'] : 'Vancouver Canucks',
    ['VGK'] : 'Vegas Golden Knights',
    ['VMI'] : 'Vancouver Millionaires',
    ['VIC'] : 'Victoria Cougars',
    ['WIN'] : 'Winnipeg Jets (1979)',
    ['WPG'] : 'Winnipeg Jets',
    ['WSH'] : 'Washington Capitals'
};

hashChange = function(){
console.log(page)
    var page = window.location.hash.replace('#', '');
    console.log(page)
    var parts = page.split("_");
    var dataToLoad = ""+parts[0]+"/"+parts[1]+".txt";
    console.log("http:\/\/www.3-1leads.com\/seasons\/"+dataToLoad)
    loadTable("http:\/\/www.3-1leads.com\/seasons\/"+dataToLoad)
}

 $(window).on('hashchange', hashChange);

var createSidebarHeader = function(seasonYear){
    var sidebarItem = document.createElement('li');
    var sidebarItemHeader = document.createElement('a');
    sidebarItemHeader.textContent = seasonYear;
    sidebarItemHeader.setAttribute('class', 'notlink sidebarHeader');
    sidebarItem.appendChild(sidebarItemHeader)
    return sidebarItem
}

var createSidebarItems = function(seasonYear, seasonData) {
    var sidebarItemContent = document.createElement('div');
    var childList = document.createElement('ul');
    childList.setAttribute('class', 'nav nav-sidebar');
    for (var dataSource of seasonData) {
        var dataParts = dataSource.split(',');
        var childListItem = document.createElement('li');
        var childListLink = document.createElement('a');
        childListLink.textContent = dataParts[0];
        childListLink.setAttribute('href', '#'+seasonYear+'_'+dataParts[0].replace(' ', ''));
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
        var part = parseResponse(response)
        var header = document.createElement('h3');
        header.textContent = part[0]
        header.setAttribute('class', 'highlight')
        content.appendChild(header)
        makeStats(part)
        createTable(part)
    })
};

var makeStats =  function(data) {
    var totalWins = new Array;
    var totalLosses = new Array;
    var totalTies = new Array;
    var blownLeadTeams = [];
    var comebackTeams = [];
    var keptTeams = [];
    var badTeams = [];
    var blownTieTeams = [];
    var comebackTieTeams = [];
    var commonWScore = [];
    var commonLScore = [];
    var commonTScore = [];

    var mostComebacks = 0;
    var mostBlownLeads = 0;
    var mostBlownTies = 0;
    var mostComebackTies = 0;
    var keptLeads = 0;
    var mostStillBad = 0;
    var numberOfWScore = 0;
    var numberOfLScore = 0;
    var numberOfTScore = 0;

    var mostBlownLeadTeams = "";
    var mostComebackTeams = "";
    var mostKeptTeams = "";
    var mostBadTeams = "";
    var mostBlownTieTeams = "";
    var mostComebackTieTeams = "";
    var mostCommonWScore = "";
    var mostCommonLScore = "";
    var mostCommonTScore = "";

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

            commonLScore[result.score] = commonLScore[result.score] || 0
            commonLScore[result.score] += 1
            if (commonLScore[result.score] > numberOfLScore) {
                numberOfLScore = commonLScore[result.score];
                mostCommonLScore = result.score
            } else if (commonLScore[result.score] == numberOfLScore){
                mostCommonLScore += ", " + result.score
            }

        } else if (result.result == "W") {
            totalWins.push(result)
            keptTeams[result.leadingTeam] = keptTeams[result.leadingTeam] || 0
            keptTeams[result.leadingTeam] += 1
            if (keptTeams[result.leadingTeam] > keptLeads){
                keptLeads = keptTeams[result.leadingTeam];
                mostKeptTeams = result.leadingTeam
            } else if (keptLeads == keptTeams[result.leadingTeam]) {
                mostKeptTeams += ", " + result.leadingTeam
            }

            badTeams[result.trailingTeam] = badTeams[result.trailingTeam]|| 0
            badTeams[result.trailingTeam] += 1
            if (badTeams[result.trailingTeam] > mostStillBad) {
                mostStillBad = badTeams[result.trailingTeam];
                mostBadTeams = result.trailingTeam
            } else if (mostStillBad == badTeams[result.trailingTeam]){
                mostBadTeams += ", " + result.trailingTeam
            }

            commonWScore[result.score] = commonWScore[result.score] || 0
            commonWScore[result.score] += 1
            if (commonWScore[result.score] > numberOfWScore) {
                numberOfWScore = commonWScore[result.score];
                mostCommonWScore = result.score
            } else if (commonWScore[result.score] == numberOfWScore){
                mostCommonWScore += ", " + result.score
            }
        } else if (result.result == "T"){
            totalTies.push(result)
            blownTieTeams[result.leadingTeam] = blownTieTeams[result.leadingTeam] || 0
            blownTieTeams[result.leadingTeam] += 1
            if (blownTieTeams[result.leadingTeam] > mostBlownTies){
                mostBlownTies = blownTieTeams[result.leadingTeam];
                mostBlownTieTeams = result.leadingTeam
            } else if (mostBlownTies == blownTieTeams[result.leadingTeam]) {
                mostBlownTieTeams += ", " + result.leadingTeam
            }

            comebackTieTeams[result.trailingTeam] = comebackTieTeams[result.trailingTeam] || 0
            comebackTieTeams[result.trailingTeam] += 1
            if (comebackTieTeams[result.trailingTeam] > mostComebackTies){
                mostComebackTies = comebackTieTeams[result.trailingTeam];
                mostComebackTieTeams = result.trailingTeam
            } else if (mostComebackTies == comebackTieTeams[result.trailingTeam]) {
                mostComebackTieTeams += ", " + result.trailingTeam
            }

            commonTScore[result.score] = commonTScore[result.score] || 0
            commonTScore[result.score] += 1
            if (commonTScore[result.score] > numberOfTScore) {
                numberOfTScore = commonTScore[result.score];
                mostCommonTScore = result.score
            } else if (commonTScore[result.score] == numberOfTScore){
                mostCommonTScore += ", " + result.score
            }
        }
    }
    var retainedLeads = document.createElement('p')
    retainedLeads.innerHTML = "Total wins after having a 3-1 leads: <span class='highlight'>" + totalWins.length + "</span>";
    content.appendChild(retainedLeads)
    var blownLeads = document.createElement('p')
    blownLeads.innerHTML = "Total blown 3-1 leads: <span class='highlight'>" + totalLosses.length + "</span>";
    content.appendChild(blownLeads)
    if(totalTies.length != 0){
        var tiedLeads = document.createElement('p')
        tiedLeads.innerHTML = "Total tied up 3-1 leads: <span class='highlight'>" + totalTies.length + "</span>";
        content.appendChild(tiedLeads)
    }
    var percentage = document.createElement('p')
    percentage.innerHTML = "Percentage of blown 3-1 leads: <span class='highlight'>" + Math.round((totalLosses.length/(totalLosses.length+totalWins.length))*10000)/100 + "%</span>";
    content.appendChild(percentage)
    if(totalTies.length != 0){
        var tiedPercentage = document.createElement('p')
        tiedPercentage.innerHTML = "Percentage of blown 3-1 leads including ties: <span class='highlight'>" + Math.round(((totalLosses.length+totalTies.length)/(totalLosses.length+totalWins.length+totalTies.length))*10000)/100 + "%</span>";
        content.appendChild(tiedPercentage)
    }
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
    var badTeamsContent = document.createElement('p')
    badTeamsContent.innerHTML = "Team(s) with the most losses after being down 3-1: <span class='highlight'>" + mostBadTeams + " (" + mostStillBad + ")</span>";
    content.appendChild(badTeamsContent)

    if(totalTies.length != 0){
        var blownTieContent = document.createElement('p')
        blownTieContent.innerHTML = "Team(s) with the most blown 3-1 leads resulting in a tie: <span class='highlight'>" + mostBlownTieTeams + " (" + mostBlownTies + ")</span>";
        content.appendChild(blownTieContent)
        var comebackTieContent = document.createElement('p')
        comebackTieContent.innerHTML = "Team(s) with the most comebacks from a 3-1 lead resulting in a tie: <span class='highlight'>" + mostComebackTieTeams + " (" + mostComebackTies + ")</span>";
        content.appendChild(comebackTieContent)
    }

    var keptLeadsScore = document.createElement('p')
    keptLeadsScore.innerHTML = "Most common score(s) for teams that won after having a 3-1 lead: <span class='highlight'>" + mostCommonWScore + " (" + numberOfWScore + ")</span>";
    content.appendChild(keptLeadsScore)
    if(mostComebacks != 0){
        var comebackScore = document.createElement('p')
        comebackScore.innerHTML = "Most common score(s) for 3-1 comebacks: <span class='highlight'>" + mostCommonLScore + " (" + numberOfLScore + ")</span>";
        content.appendChild(comebackScore)
    }
    if(totalTies.length != 0){
        var tiedScore = document.createElement('p')
        tiedScore.innerHTML = "Most common score(s) for 3-1 leads ending in a tie: <span class='highlight'>" + mostCommonTScore + " (" + numberOfTScore + ")</span>";
        content.appendChild(tiedScore)
    }
}

var parseResponse = function(response) {
    var allData = response.split('\n')
    var season = new Array;
    for (var item of allData) {
        item = item.split(" ")
        if (item[0] == "" || item[0] == undefined) {
        } else if (item.length == 2) {
            season.push(item[0] + " " + toTitleCase(item[1]));
        } else if (item.length == 3) {
            season.push(item[0] + " " + toTitleCase(item[1]) + " " + toTitleCase(item[2]));
        } else {
            var month = toTitleCase(item[0])
            var result = new Result(month + " " + item[1] + " " + item[2],
            item[3],
            item[4],
            item[5],
            item[6]);
            season.push(result);
        }
    }
    return season;
}
var toTitleCase = function(string) {
    var newString = string.toLowerCase()
    return newString[0].toUpperCase() + newString.slice(1)
}

var createTable = function(data) {
    data.shift()
    var table = document.createElement('table');
    var tableHeader = document.createElement('tr');
    tableHeader.setAttribute('bgcolor', '#6A1313')
    var td = document.createElement('th');
    td.textContent = "Date";
    td.setAttribute('align', 'right');
    td.setAttribute('class', 'highlight');
    var tl = document.createElement('th');
    tl.textContent = "Leading Team";
    tl.setAttribute('align', 'right');
    tl.style.paddingLeft = '25px'
    tl.setAttribute('class', 'highlight');
    var tr = document.createElement('th');
    tr.textContent = "Result";
    tr.setAttribute('align', 'right');
    tr.setAttribute('class', 'highlight');
    var ts = document.createElement('th');
    ts.textContent = "Score";
    ts.setAttribute('align', 'right');
    ts.setAttribute('class', 'highlight');
    var tt = document.createElement('th');
    tt.textContent = "Trailing Team";
    tt.setAttribute('align', 'right');
    tt.style.paddingLeft = '25px'
    tt.setAttribute('class', 'highlight');
    tableHeader.append(td);
    tableHeader.append(tl);
    tableHeader.append(tr);
    tableHeader.append(ts);
    tableHeader.append(tt);
    table.appendChild(tableHeader);
    var index = 0;
    for (result of data) {
        var row = document.createElement('tr');
        if(++index%2 == 0 ){
            row.setAttribute('bgcolor', '#6A1313')
        }
        var rd = document.createElement('td');
        rd.textContent = result.date;
        rd.setAttribute('align', 'left');
        var rl = document.createElement('td');
        rl.textContent = allTeams[result.leadingTeam];
        rl.setAttribute('align', 'right');
        rl.style.paddingLeft = '15px'
        var rr = document.createElement('td');
        rr.textContent = result.result;
        rr.setAttribute('align', 'center');
        var rs = document.createElement('td');
        rs.textContent = result.score;
        rs.setAttribute('align', 'center');
        var rt = document.createElement('td');
        rt.textContent = allTeams[result.trailingTeam];
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
