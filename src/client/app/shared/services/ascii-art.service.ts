import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ASCIIArtService {
  // https://www.ascii-art-generator.org/
  styles = 'font-family: monospace;';

  banner() {
    console.log(`%c
#     # #######    #    #     #
##    # #         # #   ##    #
# #   # #        #   #  # #   #
#  #  # #####   #     # #  #  #
#   # # #       ####### #   # #
#    ## #       #     # #    ##
#     # ####### #     # #     #
    `, this.styles);
  }

  block() {
    console.log(`%c
_|      _|  _|_|_|_|    _|_|    _|      _|
_|_|    _|  _|        _|    _|  _|_|    _|
_|  _|  _|  _|_|_|    _|_|_|_|  _|  _|  _|
_|    _|_|  _|        _|    _|  _|    _|_|
_|      _|  _|_|_|_|  _|    _|  _|      _|
    `, this.styles);
  }

  lean() {
    console.log(`%c
    _/      _/  _/_/_/_/    _/_/    _/      _/
   _/_/    _/  _/        _/    _/  _/_/    _/
  _/  _/  _/  _/_/_/    _/_/_/_/  _/  _/  _/
 _/    _/_/  _/        _/    _/  _/    _/_/
_/      _/  _/_/_/_/  _/    _/  _/      _/
    `, this.styles);
  }

  slant() {
    console.log(`%c
    _   ___________    _   __
   / | / / ____/   |  / | / /
  /  |/ / __/ / /| | /  |/ /
 / /|  / /___/ ___ |/ /|  /
/_/ |_/_____/_/  |_/_/ |_/
    `, this.styles);
  }
}
