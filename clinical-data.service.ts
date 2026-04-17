// clinical-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ClinicalRecord } from '../models/clinical-record.model';

@Injectable({ providedIn: 'root' })
export class ClinicalDataService {
  private apiUrl = '/api/v1/clinical-records';

  constructor(private http: HttpClient) {}

  getRecordsByFacility(facilityId: string): Observable<ClinicalRecord[]> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<ClinicalRecord[]>(`${this.apiUrl}/facility/${facilityId}`, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  submitRecord(record: ClinicalRecord): Observable<ClinicalRecord> {
    return this.http.post<ClinicalRecord>(this.apiUrl, record)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    const message = error.error?.message || 'An unexpected error occurred';
    console.error(`[ClinicalDataService] ${message}`);
    return throwError(() => new Error(message));
  }
}
