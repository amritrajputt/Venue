import { NextResponse } from "next/server";

export class ApiError extends Error {
  statusCode: number;
  errors?: any;
  success: boolean;

  constructor(statusCode: number = 500, message: string = "Something went wrong", errors: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

export class ApiResponse<T = any> {
  statusCode: number;
  data: T | null;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T | null = null, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success<T>(data: T = null as T, message: string = "Success", statusCode: number = 200) {
    return NextResponse.json(
      {
        success: true,
        statusCode,
        message,
        data,
      },
      { status: statusCode }
    );
  }

  static error(message: string = "An error occurred", statusCode: number = 500, errors: any = null) {
    return NextResponse.json(
      {
        success: false,
        statusCode,
        message,
        errors,
      },
      { status: statusCode }
    );
  }
}
