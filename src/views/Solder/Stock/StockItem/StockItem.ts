import type { User } from "../../../../interface/user";
import type { StockItem, StockItemLabel, StockItemLot, StockItemType } from "../../../../interface/stock";
import { ElMessage } from "element-plus";
import axios from "axios";
import {convertKeysToPEP8,convertPep8ToCamelCase2} from "../../../../utils/key-converter"


function getBackendErrorMessage(error: any): string {
  return error?.response?.data?.detail || error?.response?.data || error?.message || 'Unknown error';
}

/**
 * Initialize a StockItem with default values.
 * @param opType Operation type
 * @returns StockItem with defaults
*/
export function initializeStockItem(opType: StockItemType): StockItem {
  return {
    label: "",
    // dateOfCreated: undefined,
    location: "",
    remainQuantity: 0,
    quantity: 0,
    assumedQuantity: 0,
    receiver: "",
    operationType: opType
  };
}

/**
 * Create a StockItem via API.
 * @param stockItem StockItem data
 * @returns Promise with created StockItem or null
*/
export async function createStockItem(stockItem: StockItem): Promise<StockItem|null> {
  const url = "/stock/create_stock_item";
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItem);
  
  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const newStockItem =  convertPep8ToCamelCase2(response.data) as StockItem;
    ElMessage.success("process completed");
    
    return newStockItem;
  } catch (error) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
    
    // Optionally, show a more user-friendly error message
    // ElMessage.error("Please correct the errors in the form.");
  }
  return null;
}

/**
 * Get a StockItem by id via API.
 * @param id StockItem id (number)
 * @returns Promise with StockItem or null
 */
export async function getStockItem(id: number): Promise<StockItem|null> {
  const url = "/stock/get_stock_item_by_id";
  const data = new FormData();
  data.append("id", id.toString());
  try {
    const response = await axios.post(url, data);
    const stockItem = response.data ? convertPep8ToCamelCase2(response.data) as StockItem : null;
    return stockItem;
  } catch (error) {
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
  return null;
}

/**
 * Update a StockItem via API.
 * @param stockItem StockItem data
 * @returns Promise with updated StockItem or null
 */
export async function updateStockItem(stockItem: StockItem): Promise<StockItem|null> {
  const url = `/stock/update_stock_item/${stockItem.id}`;
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItem);

  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend    
    const newStockItem =  response.data ? convertPep8ToCamelCase2(response.data) as StockItem : null;
    ElMessage.success("process completed");

    return newStockItem;
  } catch (error) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));

    // Optionally, show a more user-friendly error message
    // ElMessage.error("Please correct the errors in the form.");
  }
    return null;
}

/**
 * Delete a StockItem via API.
 * @param id StockItem id
 * @returns Promise<true|null> (true if success, null if error)
 */
export async function deleteStockItem(id: number): Promise<true|null> {
  const url = "/stock/delete_stock_item";

  const data = new FormData()
  data.append("id", id.toString())
  try {
    await axios.post(url, data);
    ElMessage.success("process completed");
    return true;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Get a StockItemLabel by label via API.
 * @param label Label string
 * @returns Promise with StockItemLabel or null
 */
export async function getStockItemLabel(label: string): Promise<StockItemLabel|null> {

  const url = "/stock/get_stock_item_label";
  const data = new FormData()
  data.append("label", label)

  try {
    
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const stockItemLabel =  response.data ? convertPep8ToCamelCase2(response.data) as StockItemLabel : null;

    return stockItemLabel;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Create a StockItemLabel via API.
 * @param stockItemLabel StockItemLabel data
 * @returns Promise with created StockItemLabel or null
 */
export async function createStockItemLabel(stockItemLabel: StockItemLabel): Promise<StockItemLabel|null> {
  const url = "/stock/create_stock_item_label";
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItemLabel);

  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const newStockItemLabel =  convertPep8ToCamelCase2(response.data) as StockItemLabel;
    ElMessage.success("process completed");

    return newStockItemLabel;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Update a StockItemLabel via API.
 * @param stockItemLabel StockItemLabel data
 * @returns Promise with updated StockItemLabel or null
 */
export async function updateStockItemLabel(stockItemLabel: StockItemLabel): Promise<StockItemLabel|null> {
  const url = "/stock/update_stock_item_label";
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItemLabel);

  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend    
    const newStockItemLabel =  response.data ? convertPep8ToCamelCase2(response.data) as StockItemLabel : null;
    ElMessage.success("process completed");

    return newStockItemLabel;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Get a StockItemLot by lot ID via API.
 * @param lotId Lot ID
 * @returns Promise with StockItemLot or null
 */
export async function getStockItemLot(lotId: string): Promise<StockItemLot|null> {

  const url = "/stock/get_stock_item_lot";
  const data = new FormData()
  data.append("lot_id", lotId)

  try {
    
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const stockItemLot =  response.data ? convertPep8ToCamelCase2(response.data) as StockItemLot : null;

    return stockItemLot;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Get a Designer by firstMesMaterialId via API.
 * @param lotId Lot ID
 * @returns Promise with User or null
 */
export async function getDesignerByFirstMesMaterialId(firstMesMaterialId: string): Promise<User|null> {

  const url = "/stock/get_designer_by_first_material_id";
  const data = new FormData()
  data.append("first_material_id", firstMesMaterialId)

  try {
    
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const designer =  response.data ? convertPep8ToCamelCase2(response.data) as User : null;

    return designer;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Create a StockItemLot via API.
 * @param stockItemLot StockItemLot data
 * @returns Promise with created StockItemLot or null
 */
export async function createStockItemLot(stockItemLot: StockItemLot): Promise<StockItemLot|null> {
  const url = "/stock/create_stock_item_lot";
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItemLot);

  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend
    const newStockItemLot =  convertPep8ToCamelCase2(response.data) as StockItemLot;
    ElMessage.success("process completed");

    return newStockItemLot;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}

/**
 * Update a StockItemLot via API.
 * @param stockItemLot StockItemLot data
 * @returns Promise with updated StockItemLot or null
 */
export async function updateStockItemLot(stockItemLot: StockItemLot): Promise<StockItemLot|null> {
  const url = "/stock/update_stock_item_lot";
  // Convert keys to PEP8 (snake_case) for backend
  const data = convertKeysToPEP8(stockItemLot);

  try {
    // Log the URL for debugging
    // console.log(url);
    // Send POST request to create the stock item
    const response = await axios.post(url, data);
    // Convert response keys to camelCase for frontend    
    const newStockItemLot =  response.data ? convertPep8ToCamelCase2(response.data) as StockItemLot : null;
    ElMessage.success("process completed");

    return newStockItemLot;
  } catch (error: any) {
    // Log and display error message
    console.log(error);
    ElMessage.error(getBackendErrorMessage(error));
  }
    return null;
}
