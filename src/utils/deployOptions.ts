export type DeployStatus = "success" | "error";

interface BaseDeployResponse {
  status: DeployStatus;
  reason: string;
}

export interface DeployResponseError extends BaseDeployResponse {
  status: "error";
}

export interface DeployResponseSuccess extends BaseDeployResponse {
  status: "success";
  redirectUrl: string;
}

export type DeployResponse = DeployResponseError | DeployResponseSuccess;

export interface ValidationResponse {
  isValid: boolean;
  error?: string;
}

export interface DeployStep {
  id: string;
  title: string;
  inputs: DeployInput[];
  validate?: (inputs: Record<string, string>) => Promise<ValidationResponse>;
}

export interface DeployInput {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  defaultValue?: string;
}

export interface Deployer {
  name: string;
  key: string;
  icon: string;
  active: boolean;
  inputs?: DeployInput[];
  steps?: DeployStep[];
  deploy: (inputs: Record<string, string>) => Promise<DeployResponse>;
}

const githubDeployer: Deployer = {
  name: "GitHub",
  key: "github",
  icon: "i-ph:github",
  active: true,
  steps: [
    {
      id: "auth",
      title: "Authentication",
      inputs: [
        {
          name: "GitHub Token",
          type: "password",
          placeholder: "GitHub Token",
          required: true
        }
      ],
      validate: async (inputs) => {
        // Örnek token validasyonu
        const token = inputs["GitHub Token"];
        if (!token) {
          return { isValid: false, error: "Token is required" };
        }
        if (token.length < 40) {
          return { isValid: false, error: "Invalid token format" };
        }
        try {
          // Token validasyonu için GitHub API'ye istek atılabilir
          return { isValid: true };
        } catch (error) {
          return { 
            isValid: false, 
            error: error instanceof Error ? error.message : "Token validation failed"
          };
        }
      }
    },
    {
      id: "repo",
      title: "Repository",
      inputs: [
        {
          name: "Repository Name",
          type: "text",
          placeholder: "Repository Name",
          required: true
        },
        {
          name: "Is Private",
          type: "checkbox",
          placeholder: "Is Private",
          required: false,
        }
      ],
      validate: async (inputs) => {
        const repoName = inputs["Repository Name"];
        if (!repoName) {
          return { isValid: false, error: "Repository name is required" };
        }
        try {
          // Repo varlığı kontrolü için GitHub API'ye istek atılabilir
          return { isValid: true };
        } catch (error) {
          return {
            isValid: false,
            error: `Repository check failed: ${error instanceof Error ? error.message : "Unknown error"}`
          };
        }
      }
    }
  ],
  deploy: async (inputs: Record<string, string>): Promise<DeployResponse> => {
    try {
      return { status: "error", reason: "Not implemented yet" };
    } catch (error) {
      return {
        status: "error",
        reason: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }
};

const vercelDeployer: Deployer = {
  name: "Vercel",
  key: "vercel",
  icon: "i-ph:vercel",
  active: true,
  inputs: [
    {
      name: "Vercel Token",
      type: "password",
      placeholder: "Vercel Token",
      required: true
    }
  ],
  deploy: async () => ({ status: "error", reason: "Not implemented yet" })
};

// ... other deployers remain same ...

export const DEPLOYERS = new Map<string, Deployer>([
  ["github", githubDeployer],
  ["vercel", vercelDeployer],
  // ... other deployers
]);

// ... rest of the utility functions remain same ...
