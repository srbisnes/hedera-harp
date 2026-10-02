import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal, Cpu, Shield, Layers, BookOpen } from 'lucide-react';
import { playTechChirp } from '../../utils/audioHaptic';

export const BlueprintViewer: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'solidity' | 'firmware' | 'pinout' | 'deck' | 'sequence'>('solidity');
  const [copied, setCopied] = useState(false);

  const SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HederaShieldEscrow
 * @dev Manages confidential business escrows conditional on Hedera Consensus Service (HCS) physical shielding proofs.
 */
contract HederaShieldEscrow {
    address public admin;
    address public trustedHardwareSigner;

    struct ShieldedSession {
        address initiator;
        address beneficiary;
        uint256 amount;
        bool isShieldedVerified;
        bool executed;
    }

    mapping(bytes32 => ShieldedSession) public sessions;

    event SessionCreated(bytes32 indexed sessionId, address indexed initiator, address indexed beneficiary, uint256 amount);
    event PhysicalShieldVerified(bytes32 indexed sessionId, uint256 timestamp);
    event EscrowExecuted(bytes32 indexed sessionId, address beneficiary, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "HSP: Only admin allowed");
        _;
    }

    constructor(address _hardwareSigner) {
        admin = msg.sender;
        trustedHardwareSigner = _hardwareSigner;
    }

    function createSession(bytes32 _sessionId, address _beneficiary) external payable {
        require(msg.value > 0, "HSP: Must deposit funds");
        require(sessions[_sessionId].initiator == address(0), "HSP: Session exists");

        sessions[_sessionId] = ShieldedSession({
            initiator: msg.sender,
            beneficiary: _beneficiary,
            amount: msg.value,
            isShieldedVerified: false,
            executed: false
        });

        emit SessionCreated(_sessionId, msg.sender, _beneficiary, msg.value);
    }

    /**
     * @dev Submits a signed attestation from the Edge TEE node registered on Hedera HCS.
     */
    function verifyPhysicalShielding(
        bytes32 _sessionId,
        uint256 _timestamp,
        bytes memory _signature
    ) external {
        require(sessions[_sessionId].initiator != address(0), "HSP: Session not found");
        
        bytes32 messageHash = keccak256(abi.encodePacked(_sessionId, _timestamp, "HEDERA_SHIELD_ACTIVE"));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\\x19Ethereum Signed Message:\\n32", messageHash));
        
        require(recoverSigner(ethSignedMessageHash, _signature) == trustedHardwareSigner, "HSP: Invalid Hardware TEE Proof");

        sessions[_sessionId].isShieldedVerified = true;
        emit PhysicalShieldVerified(_sessionId, _timestamp);
    }

    function releaseEscrow(bytes32 _sessionId) external {
        ShieldedSession storage session = sessions[_sessionId];
        require(session.isShieldedVerified, "HSP: Physical shielding not verified via HCS");
        require(!session.executed, "HSP: Escrow already executed");

        session.executed = true;
        payable(session.beneficiary).transfer(session.amount);

        emit EscrowExecuted(_sessionId, session.beneficiary, session.amount);
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "HSP: invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}`;

  const FIRMWARE_CODE = `// ESP32-S3 Firmware: esp32_tee_shield.ino
#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_system.h>

// Ultrasonic PWM Config
const int ULTRASONIC_PIN = 25;
const int PWM_FREQ = 25000; // 25kHz Ultrasonic frequency
const int PWM_CHANNEL = 0;
const int PWM_RESOLUTION = 8;

// Telemetry & Hardware State
const char* HEDERA_HCS_RELAY = "https://testnet.mirrornode.hedera.com/api/v1/topics/";
const char* TOPIC_ID = "0.0.654321";

void setup() {
    Serial.begin(115200);
    
    // Initialize Hardware PWM for Ultrasonic Transducers
    ledcSetup(PWM_CHANNEL, PWM_FREQ, PWM_RESOLUTION);
    ledcAttachPin(ULTRASONIC_PIN, PWM_CHANNEL);
    
    // Activate Jamming
    ledcWrite(PWM_CHANNEL, 128); // 50% Duty cycle
    Serial.println("[HSP Hardware] Ultrasonic Jammer Array: ACTIVE (25kHz)");
}

void loop() {
    // Generate Heartbeat Attestation Payload
    uint32_t timestamp = millis() / 1000;
    String payload = "{\\"device_id\\":\\"SHIELD-NODE-01\\",\\"status\\":\\"ACTIVE\\",\\"timestamp\\":" + String(timestamp) + "}";
    
    Serial.print("[HSP HCS Telemetry Emission] -> ");
    Serial.println(payload);
    
    // Simulate telemetry broadcast to Hedera Consensus Service every 10 seconds
    delay(10000);
}`;

  const PINOUT_CODE = `# ESP32-S3 Hardware Schematics & Pinout Specification

## Microcontroller: ESP32-S3-WROOM-1 + ATECC608B
- Pin 25: PWM Channel 0 -> Ultrasonic Piezo Array (25kHz / 50% Duty Cycle)
- Pin 26: Voice-Mix Pink Noise DAC Audio Out
- Pin 32: I2S IN (MEMS Acoustic Sniffer Microphone)
- Pin 33: Optical Chassis Tamper Sensor (Normally High)
- Pin 21 (SDA) / Pin 22 (SCL): I2C ATECC608B Cryptoprocessor Secure Element
- ADC 34: LiPo 3.7V Battery Voltage Divider
- Vin / Vext: 5V DC / USB-C PD with Overvoltage Protection`;

  const DECK_CODE = `# Pitch Deck Structure: Hedera Shield Protocol (HSP)

## Diapositiva 1: Portada
- Hedera Shield Protocol (HSP)
- Verifiable Physical Privacy for Hedera-powered Governance & Escrows.
- Securing physical meetings with DePIN hardware and Hedera Consensus.

## Diapositiva 2: El Problema
1. Filtraciones acústicas en juntas directivas y comités multisig.
2. Bloqueadores analógicos sin atestación criptográfica verificable.
3. Gas volátil y puentes inseguros en otras L1s.

## Diapositiva 3: La Solución HSP
1. Edge Hardware TEE (ESP32-S3 + ATECC608B).
2. Proof-of-Physical-Shielding (PoPS) registrado en Hedera HCS.
3. Smart Contract Escrow condicionado a prueba ambiental.

## Diapositiva 4: Por qué Hedera Hashgraph
- Tarifas predecibles en USD ($0.0001 por mensaje HCS).
- Finalidad asíncrona tolerante a fallas bizantinas (aBFT) en 3-5s.
- 100% Native Hedera Stack (HCS + HSCS).`;

  const SEQUENCE_CODE = `sequenceDiagram
    autonumber
    participant HW as Edge Shield Node (TEE)
    participant HCS as Hedera Consensus Service
    participant User as Executive / DAO Member
    participant Contract as Hedera Smart Contract
    
    HW->>HW: Activate Ultrasonic / Voice-Mix Array
    HW->>HCS: Send Signed Heartbeat (Status: Shielding Active)
    HCS-->>HCS: Assign Inmutable Consensus Timestamp ($0.0001 USD)
    User->>Contract: Init Session & Deposit Funds
    Contract->>HCS: Query Session Proof Topic
    HCS-->>Contract: Confirm Unbroken Shielding History
    Contract->>User: Release Funds / Finalize Agreement`;

  const getCurrentContent = () => {
    switch (activeCodeTab) {
      case 'solidity':
        return SOLIDITY_CODE;
      case 'firmware':
        return FIRMWARE_CODE;
      case 'pinout':
        return PINOUT_CODE;
      case 'deck':
        return DECK_CODE;
      case 'sequence':
        return SEQUENCE_CODE;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentContent());
    setCopied(true);
    playTechChirp('click');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">
              Repositorio & Blueprint
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Open Source MIT
          </span>
        </div>

        <h3 className="font-display font-bold text-base text-slate-100">
          Código Fuente y Especificación Técnica
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Archivos oficiales listos para compilar en ESP32-S3, desplegar en Hedera y presentar a grants.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950/80 rounded-xl mt-3 border border-slate-800/80">
          <button
            onClick={() => { playTechChirp('click'); setActiveCodeTab('solidity'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCodeTab === 'solidity'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HederaShieldEscrow.sol
          </button>
          <button
            onClick={() => { playTechChirp('click'); setActiveCodeTab('firmware'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCodeTab === 'firmware'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            esp32_tee_shield.ino
          </button>
          <button
            onClick={() => { playTechChirp('click'); setActiveCodeTab('pinout'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCodeTab === 'pinout'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hardware Pinout
          </button>
          <button
            onClick={() => { playTechChirp('click'); setActiveCodeTab('deck'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCodeTab === 'deck'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pitch Deck
          </button>
          <button
            onClick={() => { playTechChirp('click'); setActiveCodeTab('sequence'); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              activeCodeTab === 'sequence'
                ? 'bg-slate-800 text-cyan-300 border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mermaid Diagram
          </button>
        </div>
      </div>

      {/* Code Card with Copy */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {activeCodeTab === 'solidity' && 'smart-contracts/contracts/HederaShieldEscrow.sol'}
              {activeCodeTab === 'firmware' && 'hardware/firmware/esp32_tee_shield.ino'}
              {activeCodeTab === 'pinout' && 'hardware/schematics/ESP32_Secure_Element_PINOUT.md'}
              {activeCodeTab === 'deck' && 'pitch-deck/slides_deck_structure.md'}
              {activeCodeTab === 'sequence' && 'pitch-deck/mermaid_diagrams.md'}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed select-all">
          <code>{getCurrentContent()}</code>
        </pre>
      </div>
    </div>
  );
};
