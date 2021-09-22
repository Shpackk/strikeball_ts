import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Request, UseGuards } from '@nestjs/common';
import { KickInfoDto } from '../../src/auth/dto/kick-info.dto';
import { User } from '../../src/db/entity/user.entity';
import { JwtAuthGuard } from '../../src/passport/jwtauth/jwt-auth.guard';
import { TeamResponseDto } from './DTO/join-team-response.dto';
import { TeamService } from './team.service';
import { reqType } from '../../src/db/entity/requests.entity';

@Controller('team')
export class TeamController {

    constructor(private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/:id/players')
    async getPlayersByTeam(@Param('id', ParseIntPipe) teamId: number): Promise<User[]> {
        return await this.teamService.viewPlayersByTeamId(teamId)
    }
    
    @UseGuards(JwtAuthGuard)
    @Patch('/:id/join')
    async joinTeam(@Param('id', ParseIntPipe) teamId: number, @Request() req): Promise<TeamResponseDto> {
        return await this.teamService.joinTeam(teamId, req.user, reqType.JOIN)
    }
        
    @UseGuards(JwtAuthGuard)
    @Delete('/:id/leave')
    async leaveTeam(@Param('id', ParseIntPipe) teamId: number, @Request() req): Promise<TeamResponseDto> {
        return await this.teamService.leaveTeam(teamId, req.user, reqType.LEAVE)
    }

    @Delete('/:id/kick')
    async kickPlayer(@Param('id', ParseIntPipe) teamId: number, @Body() kickInfo: KickInfoDto): Promise<TeamResponseDto> {
        return await this.teamService.kickPlayer(teamId, kickInfo)
    }
}
