export interface ClassificationResult {
  departmentSlug: string;
  confidence: number;
  rawResponse: string;
}

export interface ITramiteClassifier {
  classify(
    extractedText: string,
    availableSlugs: string[],
  ): Promise<ClassificationResult>;
}

export const TRAMITE_CLASSIFIER = Symbol('ITramiteClassifier');
