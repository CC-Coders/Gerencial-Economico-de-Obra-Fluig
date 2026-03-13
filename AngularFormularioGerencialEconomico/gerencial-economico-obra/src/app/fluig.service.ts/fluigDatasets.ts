import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DatasetFactory {
  constructor(){
    var cookie = this.getCookie("jwt.token");
    if (cookie) {
      this.JWT = cookie;
    }
  }

  private JWT =
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MzQ0NjIxNiwiaWF0IjoxNzczNDMxODE2LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.MTgJ4dvBrXL-g89h_bXZv_afXcm0vEvDMFc5Oys-ME--tt3fbCvnTWVjqOSFZrm11_U0M9AH5zRPeUAxFXLXN3Vv_6qYqabrld9-UQRRhmXBc3-N1mEdXGEeZT6Fw3AbUxM79lvVHyLp5FBXIMGsCUN13sY0Rs12LivMn7z3u9Qb24N3qXIQPLh1c1M9wmp8MSxKkEaUEvPxZBePh6sn0CRie19YN4KStwr37ndJImA6jkRFQSt9J2r_MJ-_jXOTJFaFB0H5rGuggbVyYguHqbXO9R5k7JKLRlHCCL_-ocDoqgi5mBkV7uVQuJ6KkY0fmDS_QJYFoGFUcss9M6eJVA';

  static ConstraintType = {
    MUST: 1,
    SHOULD: 2,
    MUST_NOT: 3,
  };
  async getDataset(name: string, fields: [], constraints: any, order: []) {
    var request = await fetch(
      'http://desenvolvimento.castilho.com.br:3232/api/public/ecm/dataset/datasets',
      {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          fields: null,
          constraints: constraints,
          order: null,
        }),
        headers: {
          Authorization: 'Bearer ' + this.JWT,
          'Content-Type': 'application/json',
        },
      },
    );

    var response = await request.json();
    return response.content;
  }
  static createConstraint(
    field: string,
    initialValue: string,
    finalValue: string,
    type: number,
    likeSearch: string | null | undefined,
  ) {
    return {
      _field: field,
      _initialValue: initialValue != null ? initialValue : '___NULL___VALUE___',
      _finalValue: finalValue != null ? finalValue : '___NULL___VALUE___',
      _type: type,
    };
  }
  getCookie(cookieName: string) {
    var decodedCookie = decodeURIComponent(document.cookie).split(';');
    for (const cookie of decodedCookie) {
      var [name, value] = cookie.split('=');
      if (cookieName.trim() == name.trim()) {
        return value;
      }
    }
    return false;
  }
}
