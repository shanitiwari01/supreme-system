import { by } from 'detox';
import React from 'react';
import TestPage from '../app/screens/Student/TestPage';
import { create, act } from 'react-test-renderer';
import { LanguageMBL } from "mobilebusinesslayer";
import SQLite from 'react-native-sqlite-storage';


// jest.mock('react-native-sqlite-storage', () => {
//     // const mockSQLite = require('react-native-sqlite-storage');
//     const mockSQLite = {
//       openDatabase: (...args) => {
//         return {
//           transaction: (...args) => {
//             executeSql: (query) => { return []; }
//           }
//         };
//       }
//     }
  
//     return mockSQLite;
// });

// jest.mock('react-native-sqlite-storage', () => ({
//   DEBUG: jest.fn,
//   enablePromise: jest.fn(),
//   openDatabase: (...args) => {
//     return {
//       transaction: (...args) => Promise.resolve({
//         executeSql: (query) => {
//           return Promise.resolve([]);
//         }
//       }),
//       cleanDb: ()=> Promise.resolve(),
//       executeSql: (query) => {
//         return Promise.resolve([]);
//       }
//     };
//   },
// }));

// test('fetchStudents', async (done: any) => {
//   let students: any = await new Promise((resolve, reject) => {
//     function callbackFunc() {
//       try {
//         resolve({id: 1, name: "test", fetch: true, StatusCode: 200})
//         done();
//       } catch (error) {
//         reject();
//         done(error);
//       }
//     }
//     setTimeout(() => {
//       callbackFunc();
//     }, 1000)
//   });

//   console.log("students", students);
//   expect(students.StatusCode).toBe(200);
// });

// describe('queries test', () => {
//   // Setup
//   const db = SQLite.openDatabase(
//       {
//           name: 'liberateliteText',
//           location: 'default',
//           createFromLocation: '~www/liberateliteText.db',
//       },
//       () => { console.log("Connected"); },
//       (error: any) => {
//           console.log("ERROR: " + error);
//       }
//   );
//   console.log("db", db);

//   SQLite.enablePromise(true);

//   test('StudentMBL', done => {
//     async function callback(data) {
//       try {
//         let insert = await data.executeSql(`INSERT INTO Students (StudentID, FirstName, MiddleName, LastName, MothersName, Age, PhoneNumber, Dob, Gender, AddressLine1, AddressLine2, State, City, Pincode, LastLoggedIn, IsActive, AddedOn, ModifiedOn, IsSync)
//         VALUES ('3456546ref', '4', 'g', 'jf', 'Sh', 10, 9137157524, '2021-10-20', 'Male', 'West','Andheri', 'mAHA', 'mUMBAI', 4664, '1', 1, datetime('now'), datetime('now'), 1);`, []);
//         console.log("callback insert", insert);
//         let result = await data.executeSql(`SELECT StudentID, FirstName, MiddleName, LastName, Dob, Gender
//           FROM Students
//           WHERE IsActive = 1
//           ORDER BY FirstName ASC`, []);
//           console.log("callback result", result);
//         done();
//       } catch (error) {
//         console.log("callback error", data);
//         done(error);
//       }
//     }

//       return db.transaction((trans: any) => {
//         console.log("executeQuery", trans);
//       }).then(data => {
//         callback(data);
//         });
    
//     // db.transaction((trans: any) => {
//     //   console.log("executeQuery", trans);
//     //   trans.executeSql(`SELECT StudentID, FirstName, MiddleName, LastName, Dob, Gender
//     //   FROM Students
//     //   WHERE IsActive = 1
//     //   ORDER BY FirstName ASC`, [], (trans: any, results: any) => {
//     //       console.log("executeSql", results)
          
//     //   }, (error: any) => {
//     //     console.log("error", error)
//     //   });
//     // });

//     // console.log("db", db);
//     // expect(students.StatusCode).toBe(200)
//   });
// });

it('fetch languages', async () => {
    let language = await new LanguageMBL().GetLanguagesAsync();
    console.log("language", language);
    expect(language.StatusCode).toBe(200)
});

// const tree = create(<TestPage />);
//jest.runAllTimers();

// it('snapshot', () => {
//     expect(tree).toMatchSnapshot();
// });

// it('button pressed', async () => {
//     const button = tree.root.findByProps({ testID: 'MyButton' }).props;
//     await act(async () => await button.onPress());
//     const text = tree.root.findByProps({ testID: 'MyText' }).props;
//     expect(text.children).toEqual('button pressed');
// });


// jest.mock('react-native-sqlite-storage', () => {
//     // const mockSQLite = require('react-native-sqlite-storage');
//     const mockSQLite = {
//       openDatabase: (...args) => {
//         return {
//           transaction: (...args) => {
//             executeSql: (query) => { return []; }
//           }
//         };
//       }
//     }
  
//     return mockSQLite;
//   });
  
