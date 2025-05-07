
"use client";
import React, { useState, useEffect, useRef } from "react";
import ContractsHeader from "./ContractsHeader";
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { useSearchParams } from "next/navigation";
import io from "socket.io-client";

const Page = () => {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetch, setIsFetch] = useState(true);
  const [isState, setIsState] = useState(false);
  const [isUser, setIsuser] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending");
  const [contractId, setContractId] = useState(null);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    setContractId(id);
  }, []);

  const authToken = localStorage.getItem("authToken");
  const userid = localStorage.getItem("userId");
  const email = localStorage.getItem("useremail");


  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    // socketRef.current = io(API_BASE_URL.replace("/api", ""));
    socketRef.current.on("connect", () => {
      console.log("connected to server");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  // Listen for contract updates and deletions
  useEffect(() => {
    if (!socketRef.current) return;

    // Join the contract room with userId when available
    if (userId) {
      socketRef.current.emit("joinContractRoom", userId);
    }

    // Listen for contract status updates
    socketRef.current.on("contract-status-updated", (updatedContract) => {
      console.log("Received contract update:", updatedContract);

      setContracts((prevContracts) => {
        // Check if the updated contract exists in our current list
        const exists = prevContracts.some(
          (contract) => contract._id === updatedContract._id
        );

        if (exists) {
          // Replace the contract with the updated one
          return prevContracts.map((contract) =>
            contract._id === updatedContract._id ? updatedContract : contract
          );
        } else {
          // If we're viewing a single contract and that's the one updated
          if (contractId && contractId === updatedContract._id) {
            return [updatedContract];
          }
          // Otherwise, just return the current list
          return prevContracts;
        }
      });
    });

    // Listen for contract deletions
    socketRef.current.on("contract-deleted", (deletedContractId) => {
      console.log("Received contract deletion:", deletedContractId);

      // Remove the deleted contract from the state
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract._id !== deletedContractId)
      );

      // If we're viewing a specific contract that was deleted, redirect or show a message
      if (contractId && contractId === deletedContractId) {
        // Could implement redirect to contracts list here if needed
        // For now, contracts list will just be empty
      }
    });

    return () => {
      socketRef.current.off("contract-status-updated");
      socketRef.current.off("contract-deleted");
    };
  }, [socketRef, userId, contractId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("useremail");
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchContractByEmail = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/contracts/by-email/${userEmail}`
        );
        console.log(res.data, "res.data");

        if (
          res.status === 200 &&
          res.data.contracts &&
          res.data.contracts.length > 0
        ) {
          setContracts(res.data.contracts); // set directly as array
          setIsuser(false);
          console.log("Contracts fetched by email:", res.data.contracts);
        } else {
          console.log("No contracts found.");
        }
      } catch (error) {
        console.error("Failed to fetch contracts by email:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractByEmail();
  }, [userEmail, isFetch]);
  useEffect(() => {
    const fetchContracts = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/contracts/get-contracts/${userId}`
        );
        if (res.status === 200 && res.data) {
          setIsuser(true); // set isUser to true if response is OK
        }
        setContracts(res.data);
        console.log(res.data, "res.data");
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [userId, isState, isFetch]);


  const fetchContractById = async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/contracts/get-contract-by-id?id=${contractId}`
      );
      setContracts([res.data]);
      setIsuser(false);
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractById();
  }, [contractId, isFetch]);

  const filteredContracts = contracts.filter((contract) => {
    if (activeTab === "Signed") {
      return contract.status === "Accepted";
    } else if (activeTab === "Pending") {
      return contract.status !== "Accepted";
    }
    return true;
  });

  console.log(filteredContracts)

  return (
    <div className="mt-4">
      <ContractsHeader
        setIsState={setIsState}
        userId={userId}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      <div className="mt-5 flex flex-col items-center justify-center gap-4">
        {loading ? (
          <p className="text-center">Loading contracts...</p>
        ) : filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <UserCard
              setIsFetch={setIsFetch}
              isUser={isUser}
              setIsState={setIsState}
              key={contract._id}
              userid={userid}
              contract={contract}
              socket={socket}
            />
          ))
        ) : (
          <p className="text-center">No contracts found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
