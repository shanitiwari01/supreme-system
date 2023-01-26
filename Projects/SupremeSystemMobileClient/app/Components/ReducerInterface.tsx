import { ITheme } from '../models/theme';
import { ISnackBar } from '../models/snackBar';
import { ILoader } from '../models/loader';
import { IRefresh } from '../models/refresh';
import { IUser } from '../models/user';

export interface IState {
    themeReducer: ITheme;
    snackBarReducer: ISnackBar;
    loaderReducer: ILoader;
    refreshReducer: IRefresh;
    userReducer: IUser;
}
