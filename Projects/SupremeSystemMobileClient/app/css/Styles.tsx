import { StyleSheet, Dimensions, Platform } from "react-native";
import { ELEMENT_STYLES, PORTRAIT, LANDSCAPE, PLATFORM } from "utility";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

const ModeStyle = StyleSheet.create({
    portrait: { marginHorizontal: PORTRAIT.MARGIN_HORIZONTAL, marginVertical: PORTRAIT.MARGIN_VERTICAL },
    landscape: { marginHorizontal: LANDSCAPE.MARGIN_HORIZONTAL, marginVertical: LANDSCAPE.MARGIN_VERTICAL },
});

//This is common stylesheet
const CommonStyle = StyleSheet.create({
    container: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        flex: 1,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
    },
    portraitContainer: {
        marginHorizontal: 103,
        marginVertical: 20
    },
    landscapeContainer: {
        marginHorizontal: 103,
        marginVertical: 20
    },
    buttonStyle: {
        height: 45,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        borderRadius: 8,
        marginVertical: 15
    },
    deleteButton: {
        height: 45,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        borderRadius: 8,
        marginVertical: 15
    },
    deletelabelStyle: {
        color: ELEMENT_STYLES.COLORS.PRIMARY,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
    },
    labelStyle: {
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
    },
    disabledlabelStyle: {
        color: ELEMENT_STYLES.COLORS.BLACK,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
    },
    SnackBar: {
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
    },
    TextInputLabel: {
        color: "#767676",
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER
    },
    textInput: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALL,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        width: "100%",
        paddingVertical: 0,
        height: 50,
    },
    textInputContainer: {
        paddingVertical: 5
    },
    placeholderStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER
    },
    placeholderTextColor: {
        color: ELEMENT_STYLES.COLORS.PLACEHOLDER
    },
    dropdownIcon: {
        width: 25,
        height: 25,
        position: ELEMENT_STYLES.POSITION.ABSOLUTE,
        right: 10,
        top: 40,
    },
    dropdownPlaceholder: {
        color: ELEMENT_STYLES.COLORS.PLACEHOLDER
    },
    selectedTextStyle: {
        color: "#000"
    },
    multiInputRowContainer: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
    },
    multiInputWrapper: {
        flex: 1,
    },
    multiInputMidWrapper: {
        flex: 1,
        marginHorizontal: 20
    },
    fontRegular: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_REGULAR,
    },
    fontBold: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
    },
    errorText: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        color: ELEMENT_STYLES.COLORS.RED,
        position: ELEMENT_STYLES.POSITION.RELATIVE,
        marginVertical: 5
    },
    outLineColor: {
        color: "#dadada"
    },
    LHFormContainer: {
        paddingHorizontal: 10
    },
    horizontalView: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: "center",
    },
    InfoLabelStyle: {
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        padding: 5
    },
    inputContainer: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
    },
    hitSlop: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    },
    InfoPosition: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    divSpace: {
        paddingVertical: 15,
        alignItems: "center"
    },
    fullWidth: {
        width: '100%'
    },
    primaryColor: {
        color: ELEMENT_STYLES.COLORS.PRIMARY
    },
    userImageContainer: {
        marginTop: 20,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER
    },
    userImage: {
        width: wp('10%'),
        height: hp('16%'),
        borderRadius: 100
    },
    attachImage: {
        position: 'absolute',
        left: wp('39%'),
    },
    attachImageText: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        color: ELEMENT_STYLES.COLORS.TEXT,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        marginTop: 20
    },
    pickerRectangleContainer: {
        borderWidth: 1,
        borderStyle: ELEMENT_STYLES.BOARDER_STYLE.DASHED,
        borderRadius: 4,
        borderColor: ELEMENT_STYLES.COLORS.LIGHT_GREY,
        padding: 20,
        marginTop: 20,
        backgroundColor: ELEMENT_STYLES.COLORS.WHITE_GREY
    },
    flexOneContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    flexTwoContainer: {
        flex: 2,
        flexDirection: 'row',
    },
    addImageContainer: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 10
    },
    addImageText: {
        color: ELEMENT_STYLES.COLORS.PRIMARY,
        fontSize: 20,
        fontWeight: ELEMENT_STYLES.FONT_WEIGHT.BOLD,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER
    },
    addImageLabelContainer: {
        paddingLeft: 15,
        alignSelf: 'center',
        marginTop: 10
    }
})

// This stylesheet use for the table 
const CommonTableStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tableStyle: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.COLUMN,
        backgroundColor: "#ddd"
    },
    tableHeaderStyle: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        backgroundColor: "#ddd"
    },
    colTextStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALL,
        color: "#000",
        textTransform: ELEMENT_STYLES.TEXT_TRANSFORM.CAPITALIZE,
        paddingVertical: 10,
        width: width / 4,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
    },
    editButtonStyle: {
        backgroundColor: "#ff2326",
        paddingHorizontal: 8,
        paddingVertical: 6,
        elevation: 6,
    },
    button: {
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    btnRow: {
        alignContent: ELEMENT_STYLES.ALIGN_CONTENT.CENTER,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
    },
    saveButtonStyle: {
        backgroundColor: ELEMENT_STYLES.COLORS.PRIMARY,
    },
    saveLabelStyle: {
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    modalView: {
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.FLEX_START,
        margin: 0,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT
    },
    columnStyle: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    iconStyle: {
        width: 35,
        height: 30,
    },
});

// This stylesheet use for the Add, Edit page
const AddEditStudentStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    scrollViewContainer: {
        marginBottom: 50
    },
    dropdown: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        width: "100%",
        marginVertical: 5,
        borderRadius: 5,
        borderColor: "#DADADA",
        padding: 12,
        borderWidth: 1,
        height: 50,
    },
    icon: {
        marginRight: 5,
        width: 18,
        height: 18,
    },
    item: {
        paddingVertical: 15,
        paddingHorizontal: 4,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        color: "#000",
        borderBottomColor: ELEMENT_STYLES.COLORS.PLACEHOLDER,
        borderBottomWidth: 1,
    },
    textItem: {
        flex: 1,
        fontSize: ELEMENT_STYLES.FONT_SIZE.DEFAULT,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    headerContainer: {
        backgroundColor: ELEMENT_STYLES.COLORS.PRIMARY,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW_REVERSE,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        paddingVertical: 20
    },
    headerTextStyle: {
        fontSize: hp("3%"),
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        flex: 1,
    },
    btnRow: {
        alignContent: ELEMENT_STYLES.ALIGN_CONTENT.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
    },
    cancelButtonStyle: {
        backgroundColor: ELEMENT_STYLES.COLORS.GREY,
    },
    cancelLabelStyle: {
        color: ELEMENT_STYLES.COLORS.BLACK,
    },
    saveButtonStyle: {
        backgroundColor: ELEMENT_STYLES.COLORS.PRIMARY,
    },
    saveLabelStyle: {
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    pickerStyle: {
        transform: [{ rotate: ELEMENT_STYLES.TRANSFORM.ROTATE_90 }],
        paddingTop: Platform.OS === PLATFORM.ANDROID ? 15 : 0,
    },
});

const HeaderStyle = StyleSheet.create({
    container: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        width: width,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    textStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALL,
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    middleText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_REGULAR,
    },
    rightText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
    },
    icon: {
        width: 35,
        height: 35,
    },
    snackBar: {
        position: "relative",
        top: 0,
        zIndex: 1111,
    }
})

//This stylesheet use for the list
const ListStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT
    },
    listContainer: {
        borderColor: ELEMENT_STYLES.COLORS.PLACEHOLDER,
        borderWidth: 1,
        borderRadius: 18,
        borderStyle: ELEMENT_STYLES.BOARDER_STYLE.SOLID,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        padding: 5,
        marginBottom: 8,
        height: 65,
    },
    leftContaint: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER
    },
    rightContaint: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
    },
    iconStyles: {
        marginLeft: 15
    },
    listImage: {
        height: 50,
        width: 50,
        borderRadius: 15,
        marginRight: 5,
    },
    modalView: {
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.FLEX_START,
        margin: 0,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT
    },
    parentLabelStyle: {
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
    },
    childLabelStyle: {
        color: ELEMENT_STYLES.COLORS.TEXT,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
    }
});


//This stylesheet use for the snack bar
const SnackBarStyles = StyleSheet.create({
    snackBarContainer: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        height: 36,
        width: wp("100%"),
        borderColor: ELEMENT_STYLES.COLORS.PLACEHOLDER,
        position: ELEMENT_STYLES.POSITION.ABSOLUTE,
        top: 0,
    },
    labelStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.DEFAULT,
        color: ELEMENT_STYLES.COLORS.FONT_TEXT,
        marginLeft: 10
    },
    icon: {
        height: 25,
        width: 25,
        borderRadius: 25 / 2
    }
})

const LoadingStyle = StyleSheet.create({
    container: {
        position: ELEMENT_STYLES.POSITION.ABSOLUTE,
        zIndex: 1000,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        height: height,
        width: width
    },
    LoadingText: {
        color: '#fff',
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM
    }
});

const LanguagesStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
    },
    listContainer: {
        borderWidth: 1,
        borderRadius: 18,
        borderStyle: ELEMENT_STYLES.BOARDER_STYLE.SOLID,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        padding: 5,
        marginBottom: 8,
        height: 61,
    },
    textStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_REGULAR
    },
    containt: {
        marginTop: 15,
        //height: hp("85%"),
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN
    },
    headerStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        marginBottom: 18
    }
});
const SignUpStyle = StyleSheet.create({
    container: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        paddingLeft:30,
        paddingTop:20
    },
})
const SignInStyle = StyleSheet.create({
    container: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        flex: 1,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
    },
    imgStyle: {
        height: hp("8%"),
        width: wp("80%"),
    },
    headerText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        marginTop: 20
    },
    bottomText: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        alignSelf:ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        marginTop: 25,
    },
    forgotPass:{
        height:50,
        width:170,
    }
});

const ForgotPasswordStyle = StyleSheet.create({
    imgStyle: {
        height: hp("8%"),
        width: wp("80%"),
    },
    mainContainer:{
        marginVertical:30
    },
    phoneHeadingText: {
        marginVertical: 25,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        alignSelf:'center'
    },
    container: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        flex: 1,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
    },
})


const PassCodeStyle = StyleSheet.create({
    container: {
        backgroundColor: ELEMENT_STYLES.COLORS.FONT_TEXT,
        flex: 2,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
    },
    headerText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        marginTop: 20
    },
    inputFields: {
        flexDirection: ELEMENT_STYLES.FLEX_DIRECTION.ROW,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.SPACE_BETWEEN,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.FLEX_START,
        width: wp("80%"),
        alignSelf: ELEMENT_STYLES.ALIGN_SELF.CENTER
    },
    textStyle: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.SF_PRO_DISPLAY_REGULAR,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        textAlign: ELEMENT_STYLES.TEXT_ALIGN.CENTER,
        marginBottom: 20
    },
    passcodeContainer: {
        flex: 1,
        alignItems: 'center'
    },
    passInput: {
        width: '40%',
        height: 100,
    },
    borderStyleBase: {
        width: 45,
        height: 45
    },
    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },
    underlineStyleBase: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#B0B0B0',
        borderRadius: 7,
        color: '#000',
        backgroundColor: '#F4F4F4'
    },

    passcodeHeadingText: {
        marginVertical: 25,
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK
    },
    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
});
const OTPCodeStyle = StyleSheet.create({
    resendOTPLabel: {
        fontWeight: ELEMENT_STYLES.FONT_WEIGHT.BOLD
    },
    resendOTPTimer: {
        fontWeight: ELEMENT_STYLES.FONT_WEIGHT.BOLD,
        color: ELEMENT_STYLES.COLORS.PRIMARY
    }
});
const ErrorScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: ELEMENT_STYLES.ALIGN_SELF.CENTER
    },
    imageContainer: {
        alignItems: "center",
        marginVertical: 5
    },
    titleContainer: {
        marginVertical: 20
    },
    title: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.MEDIUM,
        color: ELEMENT_STYLES.COLORS.BLACK,
        textAlign: ELEMENT_STYLES.ALIGN_SELF.CENTER,
    },
    descContainer: {
    },
    description: {
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER,
        color: ELEMENT_STYLES.COLORS.TEXT,
        textAlign: ELEMENT_STYLES.ALIGN_SELF.CENTER,
    },
    buttonContainer: {
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
        marginVertical: 30,
        position: ELEMENT_STYLES.POSITION.ABSOLUTE,
        bottom: 0,
        width: "100%"
    },
    containerSize: {
        width: "40%"
    }
});

const SplashSceenStyle = StyleSheet.create({
    logoContainer: {
        flex: 1,
        justifyContent: ELEMENT_STYLES.JUSTIFY_CONTENT.CENTER,
        alignItems: ELEMENT_STYLES.ALIGN_ITEMS.CENTER,
    },
    imgStyle: {
        height: "100%",
        width: "100%"
    }
});

const DashboardStyles = StyleSheet.create({
    mainHeader: {
        alignItems: 'center',
    },
    mainHeaderText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        fontSize: ELEMENT_STYLES.FONT_SIZE.LARGE
    },
    listHeading: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15,
        paddingBottom: 20
    },
    listHeadingText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        color: ELEMENT_STYLES.COLORS.DARK_BLACK,
        fontSize: ELEMENT_STYLES.FONT_SIZE.DEFAULT
    },
    seeAllText: {
        fontFamily: ELEMENT_STYLES.FONT_FAMILY.HELVETICA_BOLD,
        color: ELEMENT_STYLES.COLORS.LIGHT_RED,
        fontSize: ELEMENT_STYLES.FONT_SIZE.SMALLER
    }
});

export {
    CommonTableStyles,
    AddEditStudentStyle,
    CommonStyle,
    HeaderStyle,
    ListStyles,
    SnackBarStyles,
    ModeStyle,
    LoadingStyle,
    LanguagesStyle,
    SignInStyle,
    SignUpStyle,
    PassCodeStyle,
    ErrorScreenStyle,
    SplashSceenStyle,
    DashboardStyles,
    OTPCodeStyle,
    ForgotPasswordStyle
};