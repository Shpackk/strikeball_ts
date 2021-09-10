import { Controller, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { KickUserDto } from './dto/kick-user.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {

    constructor(private readonly teamService: TeamService){}

    @Patch('/:id/join')
    joinTeam(@Param('id') teamId : number) {
        return this.teamService.join(teamId)
    }

    @Delete('/:id/leave')
    leaveTeam(@Param('id') teamId: number) {
        return this.teamService.leave(teamId)
    }

    @Get('/:id/players')
    playersByTeam(@Param('id') teamId: number) {
        return this.teamService.getPlayers(teamId)
    }

    @Delete('/:id/kick')
    kickPlayer(@Param('id') teamId: number, @Body() kickDto: KickUserDto) {
        return this.teamService.kickPlayer(teamId, kickDto)
    }
}
