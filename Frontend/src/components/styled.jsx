import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const DialogStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  transition: 0.3s all ease-in-out;
  ${({ isOpen }) =>
    isOpen
      ? css`
          display: flex;
          display: flex;
          pointer-events: auto;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`;
export const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgb(0 0 0 / 75%);
  opacity: 0.5;
`;
export const DialogContent = styled.div`
  z-index: 100;
  background-color: #fff;
  border-radius: 0.8rem;
  max-width: 500px;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: -1px 2px 200px 20px rgb(0 0 0 / 13%);
  @media (min-width: 576px) {
    max-width: 500px;
    margin: 1.75rem auto;
  }

  /* Vibration effect */

  &.shake {
    animation: shake 0.62s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;
export const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem; // Removed bottom padding
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
  }
`;
export const DialogClose = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  width: 2rem;
  height: 2rem;
  padding: .4rem ;
  color: #000;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1.2rem auto no-repeat;
  border-radius: 50%;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    text-decoration: none;
    background-color: #e7e7e7;
    color: #000;
    opacity: 0.75;
  }
`;
export const DialogTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;
export const DialogBody = styled.div`
  padding: 0.1rem 1.5rem 0rem 1.5rem; // Reduced top and bottom padding
  display: flex;
  justify-content: center; 

`;
export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1.25rem .75rem 1.25rem; // Removed top padding
`;
export const DialogButton = styled.button`
  margin-top: 10px;
  padding: .70rem;
  border: none;
  width: 30%;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007BFF; // Changed color to Bootstrap primary button color
  color: #fff; // Changed text color to white for better contrast
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.3s; // Added transition for smooth hover effect
  &:hover {
    background-color: #0056b3; // Darker shade of the original color
    transform: scale(1.1); // Increase size by 10% on hover
  }
`;
export const DialogButtonClose = styled.button`
  margin-left: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;
  color: #000;
  font-weight: bold;
  font-size: 16px;
  &:hover {
    background-color: rgb(23, 172, 0);
  }
`;

export const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  margin: .75rem 0;
  padding: 10px;
  border: 1px solid #007BFF;
  border-radius: 5px;
  background-color: #f8f9fa;
`;

export const AudioIcon = styled.i`
  margin-right: 10px;
  color: #007BFF;
`;

export const FileName = styled.p`
  margin: 0;
  font-size: 16px;
`;


export const DropArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin: 10px 0;
  padding: 10px;
  border: 2px dashed #007BFF;
  border-radius: 5px;
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e1f5fe; // Light blue color on hover
  }
`;