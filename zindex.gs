/**
 * JANJUA TRADERS
 * ZINDEX - DARAZ ORDER BACKEND
 *
 * یہ فائل:
 * 1. Daraz order data وصول کرے گی
 * 2. Order کو Google Sheet میں محفوظ کرے گی
 * 3. Order ID بنائے گی
 * 4. پاکستان کی تاریخ اور وقت محفوظ کرے گی
 */

// ================================
// GOOGLE SHEET SETTINGS
// ================================

const SHEET_NAME = "Orders";


// ================================
// WEB APP POST
// ================================

function doPost(e) {

  try {

    const data = e && e.parameter
      ? e.parameter
      : {};

    const orderId =
      data.Order_ID ||
      createOrderId();

    const orderDate =
      data.Order_Date ||
      getPakistanDate();

    const orderTime =
      data.Order_Time ||
      getPakistanTime();


    // ================================
    // OPEN CURRENT SPREADSHEET
    // ================================

    const spreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();


    let sheet =
      spreadsheet.getSheetByName(
        SHEET_NAME
      );


    // ================================
    // CREATE SHEET IF NOT EXISTS
    // ================================

    if (!sheet) {

      sheet =
        spreadsheet.insertSheet(
          SHEET_NAME
        );

      createHeaders(sheet);
    }


    // ================================
    // SAVE ORDER
    // ================================

    sheet.appendRow([

      orderId,

      orderDate,

      orderTime,

      data.Customer_Name || "",

      data.Mobile_WhatsApp || "",

      data.Delivery_Address || "",

      data.Platform || "Daraz",

      data.Product || "",

      data.Product_Description || "",

      data.Color || "Not Required",

      data.Size || "Not Required",

      data.Quantity || 1,

      data.Product_Price || "",

      data.Delivery_Charges || "",

      data.Product_Total || "",

      data.Total_Amount || "",

      data.Product_Link || "",

      new Date()

    ]);


    // ================================
    // SUCCESS RESPONSE
    // ================================

    return ContentService
      .createTextOutput(
        JSON.stringify({

          success: true,

          message:
            "Order successfully received.",

          Order_ID:
            orderId,

          Order_Date:
            orderDate,

          Order_Time:
            orderTime

        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );


  } catch (error) {


    // ================================
    // ERROR RESPONSE
    // ================================

    return ContentService
      .createTextOutput(
        JSON.stringify({

          success: false,

          message:
            error.message

        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  }

}


// ================================
// CREATE SHEET HEADERS
// ================================

function createHeaders(sheet) {

  sheet.appendRow([

    "Order ID",

    "Order Date",

    "Order Time",

    "Customer Name",

    "Mobile / WhatsApp",

    "Delivery Address",

    "Platform",

    "Product",

    "Product Description",

    "Color",

    "Size",

    "Quantity",

    "Product Price",

    "Delivery Charges",

    "Product Total",

    "Total Amount",

    "Product Link",

    "System Timestamp"

  ]);

}


// ================================
// CREATE ORDER ID
// ================================

function createOrderId() {

  const now =
    new Date();


  const timezone =
    "Asia/Karachi";


  const date =
    Utilities.formatDate(
      now,
      timezone,
      "yyyyMMdd"
    );


  const time =
    Utilities.formatDate(
      now,
      timezone,
      "HHmmss"
    );


  return (
    "JT-" +
    date +
    "-" +
    time
  );

}


// ================================
// PAKISTAN DATE
// ================================

function getPakistanDate() {

  return Utilities.formatDate(

    new Date(),

    "Asia/Karachi",

    "dd-MM-yyyy"

  );

}


// ================================
// PAKISTAN TIME
// ================================

function getPakistanTime() {

  return Utilities.formatDate(

    new Date(),

    "Asia/Karachi",

    "hh:mm:ss a"

  );

}


// ================================
// TEST FUNCTION
// ================================

function testZIndex() {

  const testData = {

    Order_ID:
      createOrderId(),

    Order_Date:
      getPakistanDate(),

    Order_Time:
      getPakistanTime(),

    Customer_Name:
      "Test Customer",

    Mobile_WhatsApp:
      "03000000000",

    Delivery_Address:
      "Test Address",

    Platform:
      "Daraz",

    Product:
      "Test Product",

    Product_Description:
      "Test Product Description",

    Color:
      "Black",

    Size:
      "L",

    Quantity:
      "1",

    Product_Price:
      "Rs. 42999",

    Delivery_Charges:
      "Rs. 250",

    Product_Total:
      "Rs. 42999",

    Total_Amount:
      "Rs. 43249",

    Product_Link:
      "Test Link"

  };


  const spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();


  let sheet =
    spreadsheet.getSheetByName(
      SHEET_NAME
    );


  if (!sheet) {

    sheet =
      spreadsheet.insertSheet(
        SHEET_NAME
      );

    createHeaders(sheet);

  }


  sheet.appendRow([

    testData.Order_ID,

    testData.Order_Date,

    testData.Order_Time,

    testData.Customer_Name,

    testData.Mobile_WhatsApp,

    testData.Delivery_Address,

    testData.Platform,

    testData.Product,

    testData.Product_Description,

    testData.Color,

    testData.Size,

    testData.Quantity,

    testData.Product_Price,

    testData.Delivery_Charges,

    testData.Product_Total,

    testData.Total_Amount,

    testData.Product_Link,

    new Date()

  ]);


  Logger.log(
    "ZINDEX TEST ORDER SAVED"
  );

}
