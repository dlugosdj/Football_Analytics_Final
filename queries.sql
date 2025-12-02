-- Players Average tackle per game

select col as '#', Player, TOT/GP as 'Average Tackles Per Game'
from hurst_defensive_stats_2025
where TOT/GP > 0.0
order by TOT/GP desc;



select opp.Date, opp.Opponent, opp.Rushing_TD + opp.Receiving_TD as 'Total TD', team.Tackles_TOT
from opponent_offensive_stats as opp
inner join team_defensive_stats as team on opp.Date = team.Date
order by Tackles_TOT desc;


select *
from opponent_offensive_stats

select *
from team_defensive_stats