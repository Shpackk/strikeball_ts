import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Request, UseGuards } from '@nestjs/common';
import { KickInfoDto } from 'src/auth/dto/kick-info.dto';
import { JwtAuthGuard } from 'src/passport/jwtauth/jwt-auth.guard';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {

    constructor(private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/players')
    async getPlayersByTeam(@Param('id', ParseIntPipe) teamId: number): Promise<Array<Object>> {
        return await this.teamService.viewPlayersByTeamId(teamId)
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('/:id/join')
    async joinTeam(@Param('id', ParseIntPipe) teamId: number, @Request() req): Promise<Object> {
        return await this.teamService.joinTeam(teamId, req.user, 'join')
    }
        
    @UseGuards(JwtAuthGuard)
    @Delete('/:id/leave')
    async leaveTeam(@Param('id', ParseIntPipe) teamId: number, @Request() req): Promise<Object> {
        return await this.teamService.leaveTeam(teamId, req.user, 'leave')
    }

    @Delete('/:id/kick')
    async kickPlayer(@Param('id', ParseIntPipe) teamId: number, @Body() kickInfo: KickInfoDto): Promise<Object> {
        return await this.teamService.kickPlayer(teamId, kickInfo)
    }
}
