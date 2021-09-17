import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { KickInfoDto } from 'src/auth/dto/kick-info.dto';
import { TeamIdDto } from 'src/auth/dto/team-id.dto';
import { JwtAuthGuard } from 'src/passport/jwt-auth.guard';
import { AdminAuthGuard } from 'src/passport/jwt.admin.guard';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {

    constructor(private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/players')
    getPlayersByTeam(@Param() team: TeamIdDto) {
        return this.teamService.viewPlayersByTeamId(team.id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('/:id/join')
    joinTeam(@Param() team: TeamIdDto, @Request() req) {
        return this.teamService.joinTeam(team.id, req.user, 'join')
    }
        
    @UseGuards(JwtAuthGuard)
    @Delete('/:id/leave')
    leaveTeam(@Param() team: TeamIdDto, @Request() req) {
        return this.teamService.leaveTeam(team.id, req.user, 'leave')
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id/kick')
    kickPlayer(@Param() team: TeamIdDto, @Body() kickInfo: KickInfoDto) {
        return this.teamService.kickPlayer(team.id, kickInfo)
    }
}
