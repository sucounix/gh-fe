import React, { useEffect, useState } from "react";
import "./AstraChatHistory.scss";
import axios from "axios";
import { motion } from "framer-motion";
import { handleResponseError } from "../../../../utils/errorHandling";
import { Loader, TextInput } from "@mantine/core";

export default function AstraChatHistory({ setThreadId, setIsHistoryOpen }) {
  const [threads, setThreads] = useState([]);
  const [shownThreads, setShownThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/astra/user/threads")
      .then((response) => {
        setThreads(response.data.threads);
        setShownThreads(response.data.threads);
      })
      .catch((error) => {
        handleResponseError(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setThreads([]);
      setShownThreads([]);
    };
  }, []);

  const handleThreadClick = (threadId) => {
    setThreadId(threadId);
    setIsHistoryOpen(false);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;

    if (!searchQuery.length) {
      setShownThreads(threads);
    } else {
      const filteredThreads = threads.filter((thread) => {
        return thread.title
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });
      setShownThreads(filteredThreads);
    }
  };

  return loading ? (
    <div className="loading__wrapper" data-testid="loading-spinner">
      <Loader color="#771dfc" size={40} />
    </div>
  ) : (
    <div className="astra__history__wrapper" data-testid="chatHistory">
      {threads.length > 0 ? (
        <div className="search__wrapper">
          <TextInput
            placeholder="Search for..."
            icon={<i className="fas fa-magnifying-glass" />}
            onChange={handleSearch}
            data-testid="search-input"
          />
        </div>
      ) : null}

      {shownThreads.length ? (
        shownThreads.map((thread, index) => (
          <motion.div
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className="astra__history__thread"
            onClick={() => handleThreadClick(thread.thread_id)}
            data-testid="thread"
          >
            <span className="astra__history__thread__header__title">
              {thread.title && <> Q: {thread.title}</>}
            </span>

            <i className="fa-solid fa-ellipsis-vertical"></i>
          </motion.div>
        ))
      ) : (
        <div className="astra__history__empty" data-testid="no-history">
          No history available
        </div>
      )}
    </div>
  );
}
