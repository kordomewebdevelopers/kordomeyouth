import { bono_east, savannah, western, northern } from "$lib/data/cities";
import { oti, western_north, ahafo, north_east } from "$lib/data/cities";
import { eastern, upper_east, upper_west, bono } from "$lib/data/cities";
import { greater_accra, volta, ashanti, central } from "$lib/data/cities";

export const getCities = (region: string) => {
  switch (region) {
    case "savannah":
      return savannah;
    case "greater accra":
      return greater_accra;
    case "central":
      return central;
    case "northern":
      return northern;
    case "western":
      return western;
    case "eastern":
      return eastern;
    case "ashanti":
      return ashanti;
    case "north east":
      return north_east;
    case "upper east":
      return upper_east;
    case "upper west":
      return upper_west;
    case "bono":
      return bono;
    case "oti":
      return oti;
    case "western north":
      return western_north;
    case "ahafo":
      return ahafo;
    case "bono east":
      return bono_east;
    case "volta":
      return volta;
    default:
      return [];
  }
};
