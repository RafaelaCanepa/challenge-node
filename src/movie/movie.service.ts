import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/user/user.entity';
@Injectable()
export class MovieService {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async searchMovies(query: string, user: User) {
        console.log(this.configService.get<string>('RAPIDAPI_KEY'))

        
        try {
          const response = await firstValueFrom(
            this.httpService.get('https://online-movie-database.p.rapidapi.com/auto-complete', {
              params: { q: query },
              headers: {
                'x-rapidapi-key': this.configService.get<string>('RAPIDAPI_KEY'),
                'x-rapidapi-host': this.configService.get<string>('RAPIDAPI_HOST'),
              },
            }),
          );
    
          const results = response.data.d;
    
          return results.map(movie => ({
            title: movie.l,
            image: movie.i?.imageUrl || null,
          }));
        } catch (error) {
          console.error(error);
          throw new UnauthorizedException('Error searching movies');
        }
    }
}

