export const MODE = {
    PORTRAIT: "PORTRAIT",
    LANDSCAPE: "LANDSCAPE",
};

export const PORTRAIT = {
    MARGIN_LEFT: "8%",
    MARGIN_RIGHT: "8%",
    MARGIN_TOP: 20,
    MARGIN_BOTTOM: 20,
    MARGIN_HORIZONTAL: "8%",
    MARGIN_VERTICAL: 20
}

export const LANDSCAPE = {
    MARGIN_LEFT: "12%",
    MARGIN_RIGHT: "12%",
    MARGIN_TOP: 20,
    MARGIN_BOTTOM: 20,
    MARGIN_HORIZONTAL: "12%",
    MARGIN_VERTICAL: 20
}

export const ELEMENT_STYLES = {
    FONT_SIZE: {
        SMALLER: 14,
        DEFAULT: 16,
        SMALL: 18,
        MEDIUM: 20,
        LARGE: 24,
        LARGER: 28,
    },
    FONT_FAMILY: {
        HELVETICA_BOLD: "HelveticaNeueBold",
        HELVETICA_REGULAR: "HelveticaNeueRegular",
        SF_PRO_DISPLAY_REGULAR: "SFProDisplayRegular",
        SF_PRO_DISPLAY_BOLD: "SFProDisplayBold"
    },
    FONT_WEIGHT: {
        BOLD: <const>"bold",
        BOLDER: <const>"bolder",
    },
    COLORS: {
        PRIMARY: "#E2211C",
        FONT_TEXT: "#FFFFFF",
        ERROR: "#d53834",
        SECONDARY: "#0075C9",
        TEXT: "#767676",
        LIGHT_GREY: "#54565A",
        WHITE_GREY: "#F4F4F4",
        PLACEHOLDER: "#DADADA",
        PLACEHOLDER_TEXT: "#DAD4D4",
        TRANSPARENT: "rgba(0, 0, 0, 0.7)",
        BLACK: "#000000",
        DARK_BLACK: "#111111",
        GREY: "#DAD4D4",
        RED: "red",
        LIGHT_RED: "#FF4438",
        LIGHT_BLUE: "#3498DB"
    },
    JUSTIFY_CONTENT: {
        CENTER: <const>"center",
        SPACE_BETWEEN: <const>"space-between",
        FLEX_START: <const>"flex-start",
        FLEX_END: <const>"flex-end",
        SPACE_EVENLY: <const>"space-evenly"
    },
    ALIGN_ITEMS: {
        CENTER: <const>"center",
        FLEX_START: <const>"flex-start",
        FLEX_END: <const>"flex-end",
    },
    FLEX_DIRECTION: {
        ROW: <const>"row",
        COLUMN: <const>"column",
        ROW_REVERSE: <const>"row-reverse",
    },
    ALIGN_CONTENT: {
        CENTER: <const>"center"
    },
    ALIGN_SELF: {
        CENTER: <const>"center",
    },
    POSITION: {
        RELATIVE: <const>"relative",
        ABSOLUTE: <const>"absolute",
    },
    TEXT_ALIGN: {
        CENTER: <const>"center",
        LEFT: <const>"LEFT"
    },
    TEXT_TRANSFORM: {
        CAPITALIZE: "capitalize"
    },
    BOARDER_STYLE: {
        SOLID: <const>"solid",
        DASHED: <const>"dashed"
    },
    TRANSFORM: {
        ROTATE_90: "90deg"
    },
    KEYBOARD_OFFSET: {
        MAX_OFFSET: 30
    },
    BAR_FONTS: {
        DARK_CONTENT: <const>'dark-content',
        DEFAULT: <const>'default',
        LIGHT_CONTENT: <const>'light-content'
    }
};

export const IMAGE_CONSTANT = {
    IMAGE_NAME: {
        LOGO: "./../../assets/images/Logo.png",
    },
    RESIZE_MODE: {
        CONTAIN: "contain"
    }
}

export const LINEAR_GRADIENT = {
    COLORS: {
        PRIMARY: ["#E2211C", "#FF4438"],
        SECONDARY: ["#21A2FF", "#0075C9"],
        TERTIARY: ["#FFFFFF", "#F1F1F1"],
    },
    LOCATION: {
        x: 0.0,
        y: 0.99
    },
    START: {
        x: 0,
        y: 0
    },
    END: {
        x: 0,
        y: 1
    }
}

export const NUMERIC_CONSTANTS = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
}

export const CUSTOM_CONSTANTS = {
    MODE: {
        OUTLINED: <const>"outlined",
        DATE: <const>"date"
    },
    INPUT_TYPE: {
        STRING: <const>"string",
        NUMERIC: <const>"numeric",
        DIGIT: <const>"digit",
        DATE: <const>"date",
        INTEGER: <const>"integer",
    },
    KEYBOARD_TYPE: {
        DEFAULT: <const>"default",
        NUMERIC: <const>"numeric",
        INTEGER: <const>"integer",
        NUMBER_PAD: <const>"number-pad"
    },
    DATE_FORMAT: {
        DEFAULT: "YYYY-MM-DD"
    },
    DROPDOWN_CONSTANTS: {
        LABEL_FIELD: <const>"label",
        VALUE_FIELD: <const>"value",
        POSITION: <const>"auto",
        MAX_HEIGHT: 150
    },
    LOADER_SIZE: {
        LARGE: 70
    },
    SVG: {
        WIDTH: {
            SMALL: 16,
            MEDIUM: 18,
            EXTRA_MEDIUM: 30,
            LARGE: 35,
            LARGER: 45,
            SUPREMESYSTEM_ICON: "80%",
            ATTACH_IMAGE: "10%"
        },
        HEIGHT: {
            SMALL: 16,
            MEDIUM: 18,
            EXTRA_MEDIUM: 30,
            LARGE: 35,
            LARGER: 45,
            SUPREMESYSTEM_ICON: "8%",
            ATTACH_IMAGE: "10%"
        }
    },
    BUTTON: {
        TYPE: "button"
    }
}