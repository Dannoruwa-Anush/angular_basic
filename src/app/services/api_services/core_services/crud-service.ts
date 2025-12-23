import { Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../config/environment/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ApiResponseModel } from '../../../models/api_models/core_api_models/apiResponseModel';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { PaginationResponseModel } from '../../../models/api_models/core_api_models/paginationResponseModel';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> {

  //------------
  // interface: Defines the structure/contract of an object.
  //------------

  //------------
  // abstract: To define shared functionality
  // In abstract class: Can have both implemented (concrete method) and unimplemented methods (abstract methods)
  // concrete methods: Can be shared by subclasses
  // abstract methods: Must be implemented by subclasses
  //------------

  // <T>: generic

  //------------
  // private: A private member is only accessible within the class where it is defined
  // protected: A protected member is accessible within the class and its subclasses
  //------------

  //------------
  // Observable: 
  //------------

  protected baseUrl = `${environment.BASE_API_URL.replace(/\/$/, '')}/api`;

  // Abstract property that must be implemented by subclasses
  protected abstract endpoint: string;

  // ---------- STATE ----------
  protected _loading = signal(false);
  loading: Signal<boolean> = this._loading.asReadonly();

  constructor(
    // Dependency injection
    protected http: HttpClient,
  ) { }

  // ---------- HELPERS ----------
  protected handleHttpError(err: HttpErrorResponse): Observable<never> {
    this._loading.set(false);
    return EMPTY;
  }

  // ---------- CRUD ----------
  // GET_ALL
  getAll(): Observable<T[]> {
    this._loading.set(true);

    return this.http
      .get<ApiResponseModel<T[]>>(`${this.baseUrl}/${this.endpoint}`)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // GET_BY_ID
  getById(id: number | string): Observable<T> {
    this._loading.set(true);

    return this.http
      .get<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // SAVE
  create(data: T): Observable<T> {
    this._loading.set(true);

    return this.http
      .post<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}`, data)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // UPDATE
  update(id: number | string, data: T): Observable<T> {
    this._loading.set(true);

    return this.http
      .put<ApiResponseModel<T>>(`${this.baseUrl}/${this.endpoint}/${id}`, data)
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // DELETE
  delete(id: number | string): Observable<void> {
    this._loading.set(true);

    return this.http
      .delete<ApiResponseModel<void>>(`${this.baseUrl}/${this.endpoint}/${id}`)
      .pipe(
        map(res => {
          this._loading.set(false);
        }),
        catchError(err => this.handleHttpError(err))
      );
  }

  // PAGINATION: GET_ALL
  getPaged(
    pageNumber: number,
    pageSize: number,
    extraParams?: Record<string, any>
  ): Observable<PaginationResponseModel<T>> {

    this._loading.set(true);

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (extraParams) {
      Object.keys(extraParams).forEach(key => {
        const value = extraParams[key];
        if (value !== null && value !== undefined) {
          params = params.set(key, value);
        }
      });
    }

    return this.http
      .get<ApiResponseModel<PaginationResponseModel<T>>>(
        `${this.baseUrl}/${this.endpoint}/paged`,
        { params }
      )
      .pipe(
        map(res => {
          this._loading.set(false);
          return res.data;
        }),
        catchError(err => this.handleHttpError(err))
      );
  }
}