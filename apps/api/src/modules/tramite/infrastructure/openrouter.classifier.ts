import { Injectable, Logger } from '@nestjs/common';
import {
  ITramiteClassifier,
  ClassificationResult,
} from '../domain/tramite-classifier.port';

@Injectable()
export class OpenRouterClassifier implements ITramiteClassifier {
  private readonly logger = new Logger(OpenRouterClassifier.name);
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly model = 'mistralai/mistral-7b-instruct:free';

  async classify(
    extractedText: string,
    availableSlugs: string[],
  ): Promise<ClassificationResult> {
    const prompt = `Eres un clasificador de trámites municipales peruanos.
Dado el siguiente texto de un trámite, determina a qué área municipal pertenece.
Responde ÚNICAMENTE con un JSON válido, sin markdown, sin explicaciones.
Formato exacto: {"departmentSlug":"<slug>","confidence":<número entre 0 y 1>}
Slugs válidos: ${availableSlugs.join(', ')}

Texto del trámite:
"""
${extractedText.slice(0, 3000)}
"""`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1, // baja temperatura = respuestas más determinísticas
        }),
      });

      const data = await response.json();
      const rawResponse = JSON.stringify(data);
      const content: string = data.choices?.[0]?.message?.content ?? '';

      const parsed = JSON.parse(content.trim());

      return {
        departmentSlug: parsed.departmentSlug,
        confidence: parsed.confidence,
        rawResponse,
      };
    } catch (error) {
      this.logger.error('OpenRouter classification failed', error);
      // Fallback seguro — submit-tramite-use-case resolverá a secretaria-general
      return {
        departmentSlug: 'secretaria-general',
        confidence: 0,
        rawResponse: JSON.stringify({ error: String(error) }),
      };
    }
  }
}
