import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}
    
    
    @UseGuards(AuthGuard('jwt'))
    @Get('search')
    searchMovies(@Query('query') query: string, @GetUser() user: User) {
        console.log('user:', user);
        return this.movieService.searchMovies(query, user);
    }
}
