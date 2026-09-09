<?php

namespace App\Services\AI;

use RuntimeException;
use Throwable;

class AIProviderException extends RuntimeException
{
    public static function requestFailed(string $provider, int $status): self
    {
        return new self("[$provider] AI request failed with HTTP status $status.");
    }

    public static function unreachable(string $provider, ?Throwable $previous = null): self
    {
        return new self("[$provider] AI provider is unreachable.", 0, $previous);
    }

    public static function missingApiKey(string $provider): self
    {
        return new self("[$provider] API key is not configured. Set it in your .env file.");
    }
}
