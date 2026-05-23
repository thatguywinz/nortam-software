"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  initialAuditTrail,
  initialDocuments,
  PRIMARY_DOC_ID,
} from "./mockData";
import type {
  AuditEvent,
  TranslationDocument,
  UserRole,
} from "./types";

type AssureContextValue = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  documents: TranslationDocument[];
  selectedId: string;
  selectDocument: (id: string) => void;
  selectedDocument: TranslationDocument;
  auditTrail: AuditEvent[];
  markLegalReviewComplete: () => void;
  approveFinalReview: () => void;
  generateCertificate: () => void;
  submitNewRequest: () => void;
  newRequestFlash: boolean;
  setNewRequestFlash: (v: boolean) => void;
};

const AssureContext = createContext<AssureContextValue | null>(null);

export function AssureProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [documents, setDocuments] = useState<TranslationDocument[]>(
    initialDocuments
  );
  const [selectedId, setSelectedId] = useState<string>(PRIMARY_DOC_ID);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(initialAuditTrail);
  const [newRequestFlash, setNewRequestFlash] = useState(false);

  const selectedDocument = useMemo(
    () =>
      documents.find((d) => d.id === selectedId) ??
      documents[0],
    [documents, selectedId]
  );

  const updatePrimary = useCallback(
    (mutator: (d: TranslationDocument) => TranslationDocument) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === PRIMARY_DOC_ID ? mutator(d) : d))
      );
    },
    []
  );

  const appendAudit = useCallback((event: AuditEvent) => {
    setAuditTrail((prev) => {
      // Replace any pending certificate row if we're issuing.
      if (event.action.toLowerCase().includes("certificate issued")) {
        return [
          ...prev.filter((e) => e.status !== "pending"),
          event,
        ];
      }
      // Insert before pending rows.
      const pending = prev.filter((e) => e.status === "pending");
      const completed = prev.filter((e) => e.status !== "pending");
      return [...completed, event, ...pending];
    });
  }, []);

  const markLegalReviewComplete = useCallback(() => {
    updatePrimary((d) => ({
      ...d,
      reviewStatus: "Complete",
      complianceStatus: d.complianceStatus === "Not Started" ? "In Progress" : d.complianceStatus,
      status: "Compliance check",
      pipeline: {
        ...d.pipeline,
        "Human Review": "complete",
        "Compliance Check": "active",
      },
    }));
    appendAudit({
      id: `ae-${Date.now()}`,
      time: "09:44 AM",
      actor: "Amira Chen, Legal Translator",
      action: "Legal review marked complete",
      status: "complete",
    });
  }, [appendAudit, updatePrimary]);

  const approveFinalReview = useCallback(() => {
    updatePrimary((d) => ({
      ...d,
      reviewStatus: "Complete",
      complianceStatus: "Complete",
      approvalStatus: "Complete",
      certificateStatus: d.certificateStatus === "Issued" ? "Issued" : "Ready",
      status: "Awaiting certificate",
      pipeline: {
        ...d.pipeline,
        "Human Review": "complete",
        "Compliance Check": "complete",
        "Client Approval": "complete",
        "Trust Certificate": "active",
      },
    }));
    appendAudit({
      id: `ae-${Date.now()}`,
      time: "09:47 AM",
      actor: "Priya Shah, Final Approver",
      action: "Final review approved",
      status: "complete",
    });
  }, [appendAudit, updatePrimary]);

  const generateCertificate = useCallback(() => {
    updatePrimary((d) => ({
      ...d,
      certificateStatus: "Issued",
      status: "Certificate issued",
      pipeline: {
        ...d.pipeline,
        "Trust Certificate": "complete",
      },
    }));
    appendAudit({
      id: `ae-${Date.now()}`,
      time: "09:49 AM",
      actor: "Certificate Engine",
      action: "Nortam Trust Certificate issued",
      status: "complete",
    });
  }, [appendAudit, updatePrimary]);

  const submitNewRequest = useCallback(() => {
    // The new client request maps to the primary doc — reset its state to "just submitted"
    updatePrimary((d) => ({
      ...d,
      status: "Human legal review",
      reviewStatus: "In Progress",
      complianceStatus: "Not Started",
      approvalStatus: "Not Started",
      certificateStatus: "Pending",
      pipeline: {
        ...d.pipeline,
        Submitted: "complete",
        "AI Draft": "complete",
        "Risk Scored": "complete",
        "Human Review": "active",
        "Compliance Check": "pending",
        "Client Approval": "pending",
        "Trust Certificate": "locked",
      },
    }));
    setNewRequestFlash(true);
    setTimeout(() => setNewRequestFlash(false), 4200);
  }, [updatePrimary]);

  const value: AssureContextValue = {
    role,
    setRole,
    documents,
    selectedId,
    selectDocument: setSelectedId,
    selectedDocument,
    auditTrail,
    markLegalReviewComplete,
    approveFinalReview,
    generateCertificate,
    submitNewRequest,
    newRequestFlash,
    setNewRequestFlash,
  };

  return (
    <AssureContext.Provider value={value}>{children}</AssureContext.Provider>
  );
}

export function useAssure() {
  const ctx = useContext(AssureContext);
  if (!ctx) throw new Error("useAssure must be used inside AssureProvider");
  return ctx;
}
