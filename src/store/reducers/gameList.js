import { gameListConstants } from '../constants';
import { sortByValue, updateObject } from '../../shared/utility';

const initialState = {
    games: null,
    searchResults: null,
    sortingByType: 'id',
    currentSearchValue: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case gameListConstants.SET_GAMES_DATA:
            return setGamesData(state, action);
        case gameListConstants.SEARCH_VALUE_CHANGED:
            return searchValueChangedHandler(state, action);
        case gameListConstants.SORT_BY_HANDLER:
            return sortByHandler(state, action);
        default:
            return state;
    }
};

const setGamesData = (state, action) => {
    action.data.map((game, index) => {
        game.id = index;
        return game;
    });

    return updateObject(state, {
        games: action.data
    });
};

const searchValueChangedHandler = (state, action) => {
    let searchResults = state.games.filter(game => {
        return game.title.toLowerCase().startsWith(action.value);
    });

    return updateObject(state, {
        currentSearchValue: action.value,
        searchResults: action.value === '' ? null : searchResults
    });
};

const sortByHandler = (state, action) => {
    //Direction: '+' = Ascending, '-' = descending
    let sortTypeWithDirection = action.sortType;

    if (action.sortType === 'score' || action.sortType === 'editors_choice') {
        sortTypeWithDirection = '-' + action.sortType;

        if (state.sortingByType === '-' + action.sortType) {
            sortTypeWithDirection = action.sortType; //If already sorting this type in descending, switch to ascending.
        } else if (state.sortingByType === action.sortType) {
            sortTypeWithDirection = 'id'; //If already sorting this type in ascending, switch to ID.
        }
    } else {
        if (state.sortingByType === action.sortType) {
            sortTypeWithDirection = '-' + action.sortType; //If already sorting this type in ascending, switch to descending.
        } else if (state.sortingByType === '-' + action.sortType) {
            sortTypeWithDirection = 'id'; //If already sorting this type in descending, switch to ID.
        }
    }

    return updateObject(state, {
        games: state.games.sort(sortByValue(sortTypeWithDirection)),
        searchResults: state.searchResults
            ? state.searchResults.sort(sortByValue(sortTypeWithDirection))
            : null,
        sortingByType: sortTypeWithDirection
    });
};
