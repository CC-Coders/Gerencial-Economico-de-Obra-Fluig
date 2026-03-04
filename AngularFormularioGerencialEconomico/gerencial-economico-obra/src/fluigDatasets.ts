export class DatasetFactory {
  constructor(JWT: string) {
    this.JWT = JWT;
  }

  private JWT!: string;
  static ConstraintType = {
    MUST: 1,
    SHOULD: 2,
    MUST_NOT: 3,
  };

  async getDataset(name: string, fields: [], constraints: any, order: []) {
    var request = await fetch('http://desenvolvimento.castilho.com.br:3232/api/public/ecm/dataset/datasets', {
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
    });

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
}
