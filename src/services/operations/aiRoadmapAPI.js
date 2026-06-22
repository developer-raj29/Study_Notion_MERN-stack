import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { aiRoadmapEndpoints } from "../apis";
import {
  setLoading,
  setActiveRoadmap,
  setRoadmaps,
  setError,
  updateRoadmap,
} from "../../slices/aiRoadmapSlice";
const {
  GENERATE_ROADMAP_API,
  GET_MY_ROADMAPS_API,
  GET_ROADMAP_DETAILS_API,
  COMPLETE_MILESTONE_API,
  CHAT_WITH_ROADMAP_API,
} = aiRoadmapEndpoints;
// Generate AI Roadmap
export function generateRoadmap(data, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("AI is generating your learning roadmap... (takes 5-10s)");
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await apiConnector("POST", GENERATE_ROADMAP_API, data, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setActiveRoadmap(response.data.data));
      toast.success("AI Learning Roadmap generated successfully!");
      return response.data.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to generate roadmap";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      return null;
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}
// Fetch all roadmaps for the logged-in student
export function fetchMyRoadmaps(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_MY_ROADMAPS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setRoadmaps(response.data.data));
    } catch (error) {
      toast.error("Could not load your roadmaps list");
    } finally {
      dispatch(setLoading(false));
    }
  };
}
// Fetch detailed roadmap with dynamically enriched course progresses
export function fetchRoadmapDetails(id, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_ROADMAP_DETAILS_API(id), null, {
        Authorization: `Bearer ${token}`,
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setActiveRoadmap(response.data.data));
    } catch (error) {
      toast.error("Failed to load roadmap details");
    } finally {
      dispatch(setLoading(false));
    }
  };
}
// Mark milestone inside roadmap phase as complete
export function markMilestoneComplete(roadmapId, milestoneId, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Saving progress...");
    try {
      const response = await apiConnector(
        "PATCH",
        COMPLETE_MILESTONE_API(roadmapId, milestoneId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(updateRoadmap(response.data.data));
      toast.success("Milestone completed! 🎉");
    } catch (error) {
      toast.error("Failed to update milestone completion");
    } finally {
      toast.dismiss(toastId);
    }
  };
}
// Conversational chat with Roadmap AI
export async function chatWithRoadmap(id, message, token) {
  const toastId = toast.loading("Sending query to coach...");
  let reply = "";
  try {
    const response = await apiConnector(
      "POST",
      CHAT_WITH_ROADMAP_API(id),
      { message },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    reply = response.data.reply;
  } catch (error) {
    toast.error("Coach chat session failed. Please retry.");
  } finally {
    toast.dismiss(toastId);
  }
  return reply;
}
