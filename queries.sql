-- Players Average tackle per game

select col as '#', Player, TOT/GP as 'Average Tackles Per Game'
from hurst_defensive_stats_2025
where TOT/GP > 0.0
order by TOT/GP desc;


-- Yards/Attempt vs Total Tackles

select opp.Date, opp.Opponent, opp.Rushing_YDS / opp.Rushing_ATT as 'Rushing Yards/Attempt', opp.Receiving_YDS / opp.Receiving_ATT as 'Receiving Yards/Attempt', team.Tackles_TOT as 'Total Tackles'
from opponent_offensive_stats as opp
inner join team_defensive_stats as team on opp.Date = team.Date
order by Tackles_TOT desc;