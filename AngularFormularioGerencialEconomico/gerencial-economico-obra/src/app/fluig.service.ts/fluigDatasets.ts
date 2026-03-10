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
    'eyJraWQiOiI4ODg4NjYzYS01OWNiLTQzODktOTQ2YS01YzA4NDNiNGM5MjYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJnYWJyaWVsLnBlcnNpa2UiLCJyb2xlIjoiYWRtaW4sdXNlciIsInRlbmFudCI6MSwidXNlclRlbmFudElkIjo0MiwidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZmM0ZjU5ODItZWY5MC00OTcxLTg2YjAtMTZmYWM3ZDhkNmZmIiwidGVuYW50VVVJRCI6Ijg4ODg2NjNhLTU5Y2ItNDM4OS05NDZhLTVjMDg0M2I0YzkyNiIsImxhc3RVcGRhdGVEYXRlIjoxNzY0MjU4ODgwMzU2LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTc3MzE4OTYwMSwiaWF0IjoxNzczMTc1MjAxLCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.dK3POWK7d_WNqbaXBjSAfwIBGOM2wx6zK3vDE1Fe1oV-mDum6Qjt7BPCqfOsihNLTAcXVh_cjgDUxLG4ccbjbcIMdG-7LQNZXFGEXktqLw-Y-qgM8MrvUhFl9ud6O7Czia24e1nL7saCsk_lWzPd7HI0wYOj-JsAQlckBScLjenyXSQHFh1MNFYeMH0Ce27_hjgvHDdZYjH-XyLH6LIi6Mz5aUmBs59b_ilMcg2PuWAoRfTBVVRwvnV3k2VxztvRGyrgQeOnxOM_CrbPQNqfDHm29mbu56Qrkkfq55EexW956Dk71XYpWbgYnS2aHJf2ji8-T5UrQewNCs9LTjmWLw';

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
